from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from io import BytesIO
from PIL import Image
import pytesseract
from PyPDF2 import PdfReader
import re


# APP INIT
app = FastAPI(title="AI Medical Report Analyzer")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# REQUEST MODEL
class ReportRequest(BaseModel):
    fileUrl: str


# NORMAL RANGES
NORMAL_RANGES = {
    "Hemoglobin": "12–16",
    "RBC": "4.5–5.9",
    "WWBC": "4000–11000",
    "Platelets": "150000–450000",
    "Hematocrit": "36–50",
    "MCV": "80–100",
    "MCH": "27–33",
    "MCHC": "32–36",
    "Total Cholesterol": "<200",
    "HDL": ">40",
    "LDL": "<130",
    "Triglycerides": "<140",
    "Glucose Fasting": "70–100",
    "Glucose PP": "<140",
    "Creatinine": "0.6–1.3",
    "Urea": "15–45",
    "Vitamin D": "20–50",
    "Vitamin B12": "200–900",
}


# REGEX PATTERNS
REGEX_PATTERNS = {
    "Hemoglobin": r"hemoglobin[: ]+(\d+\.?\d*)",
    "RBC": r"rbc[: ]+(\d+\.?\d*)",
    "WBC": r"wbc[: ]+(\d+\.?\d*)",
    "Platelets": r"platelets?[: ]+(\d+\.?\d*)",
    "Hematocrit": r"(pcv|hematocrit)[: ]+(\d+\.?\d*)",
    "MCV": r"mcv[: ]+(\d+\.?\d*)",
    "MCH": r"mch[: ]+(\d+\.?\d*)",
    "MCHC": r"mchc[: ]+(\d+\.?\d*)",
    "Total Cholesterol": r"cholesterol[: ]+(\d+\.?\d*)",
    "HDL": r"hdl[: ]+(\d+\.?\d*)",
    "LDL": r"ldl[: ]+(\d+\.?\d*)",
    "Triglycerides": r"triglycerides[: ]+(\d+\.?\d*)",
    "Glucose Fasting": r"(fasting glucose|fbs)[: ]+(\d+\.?\d*)",
    "Glucose PP": r"(ppbs|glucose pp)[: ]+(\d+\.?\d*)",
    "Creatinine": r"creatinine[: ]+(\d+\.?\d*)",
    "Urea": r"urea[: ]+(\d+\.?\d*)",
    "Vitamin D": r"vitamin[- ]?d[: ]+(\d+\.?\d*)",
    "Vitamin B12": r"vitamin[- ]?b12[: ]+(\d+\.?\d*)",
}


# SPECIALIST RULES
SPECIALIST_RULES = {
    "Hemoglobin": "Hematologist",
    "RBC": "Hematologist",
    "WBC": "Physician",
    "Platelets": "Hematologist",
    "Hematocrit": "Physician",
    "Total Cholesterol": "Cardiologist",
    "HDL": "Cardiologist",
    "LDL": "Cardiologist",
    "Triglycerides": "Cardiologist",
    "Glucose Fasting": "Endocrinologist",
    "Glucose PP": "Endocrinologist",
    "Creatinine": "Nephrologist",
    "Urea": "Nephrologist",
    "Vitamin D": "General Physician",
    "Vitamin B12": "General Physician"
}


# SCORING SYSTEM (higher score = more serious)
PARAMETER_PRIORITY = {
    "Total Cholesterol": 10,
    "HDL": 10,
    "LDL": 10,
    "Triglycerides": 10,
    "Glucose Fasting": 9,
    "Glucose PP": 9,
    "Creatinine": 8,
    "Urea": 8,
    "Hemoglobin": 6,
    "RBC": 6,
    "Platelets": 6,
    "Hematocrit": 6,
    "WBC": 5,
    "Vitamin D": 3,
    "Vitamin B12": 3
}


# RANGE PARSER
def parse_range(range_str):
    if "–" in range_str:
        low, high = range_str.split("–")
        return float(low), float(high)
    if "<" in range_str:
        return 0, float(range_str.replace("<", ""))
    if ">" in range_str:
        return float(range_str.replace(">", "")), float("inf")
    return None, None


# PDF TEXT EXTRACTION
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text


# MEDICAL ANALYSIS
def extract_medical_values(text: str):
    results = []
    abnormal_count = 0

    for key, pattern in REGEX_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        normal_range = NORMAL_RANGES.get(key, "N/A")

        if match:
            try:
                value = float(match.groups()[-1])
                low, high = parse_range(normal_range)

                if low is not None and (value < low or value > high):
                    status = "Abnormal"
                    abnormal_count += 1
                else:
                    status = "Normal"
            except ValueError:
                value = "Invalid"
                status = "Check"
                abnormal_count += 1
        else:
            value = "Not Found"
            status = "Check"
            abnormal_count += 1

        results.append({
            "parameter": key,
            "value": value,
            "normal_range": normal_range,
            "status": status
        })

    return results, abnormal_count


# RISK LEVEL
def calculate_risk_level(abnormal_count):
    if abnormal_count <= 2:
        return "Low Risk"
    elif abnormal_count <= 5:
        return "Medium Risk"
    else:
        return "High Risk"


# ONLY ONE BEST SPECIALIST PICKER
def suggest_specialist(report_analysis):
    highest_score = -1
    best_specialist = "General Physician"

    for item in report_analysis:
        if item["status"] in ["Abnormal", "Check"]:
            param = item["parameter"]
            specialist = SPECIALIST_RULES.get(param, "General Physician")
            score = PARAMETER_PRIORITY.get(param, 1)

            # Pick the highest priority abnormal parameter
            if score > highest_score:
                highest_score = score
                best_specialist = specialist

    return best_specialist


# ANALYZE API
@app.post("/analyze")
async def analyze_report(req: ReportRequest):
    response = requests.get(req.fileUrl, timeout=10)
    content_type = response.headers.get("Content-Type", "")

    if "pdf" in content_type:
        raw_text = extract_text_from_pdf(response.content)
    else:
        img = Image.open(BytesIO(response.content))
        raw_text = pytesseract.image_to_string(img)

    report_analysis, abnormal_count = extract_medical_values(raw_text)
    risk_level = calculate_risk_level(abnormal_count)
    specialist = suggest_specialist(report_analysis)

    return {
        "success": True,
        "risk_level": risk_level,
        "abnormal_parameters": abnormal_count,
        "report_analysis": report_analysis,
        "specialist_suggestion": specialist,
        "doctor_suggestion": f"Please consult a {specialist}."
    }


# RUN SERVER
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
