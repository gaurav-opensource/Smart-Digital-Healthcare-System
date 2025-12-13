from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

import pickle
import pandas as pd
import requests
from io import BytesIO
from PIL import Image
import pytesseract
from PyPDF2 import PdfReader
import re


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load ML Model
# -----------------------------
model = pickle.load(open("heart_model.pkl", "rb"))


# -----------------------------
# 1️⃣ HEART PREDICTION API
# -----------------------------
class HeartInput(BaseModel):
    data: Dict


@app.post("/predict-heart")
def predict_heart(req: HeartInput):
    df = pd.DataFrame([req.data])
    result = model.predict(df)[0]
    return {"prediction": int(result)}


# -----------------------------
# PDF TEXT EXTRACTION (NO FITZ)
# -----------------------------
def extract_text_with_pypdf2(pdf_bytes):
    try:
        reader = PdfReader(BytesIO(pdf_bytes))
        text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        return text
    except:
        return ""

# -----------------------------
# 2️⃣ ADVANCED REPORT ANALYZER API
# -----------------------------
class ReportRequest(BaseModel):
    fileUrl: str


# master regex list for 20+ medical values
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
    "Sodium": r"sodium[: ]+(\d+\.?\d*)",
    "Potassium": r"potassium[: ]+(\d+\.?\d*)",
    "Vitamin D": r"vitamin[- ]?d[: ]+(\d+\.?\d*)",
    "Vitamin B12": r"vitamin[- ]?b12[: ]+(\d+\.?\d*)",
}


def extract_medical_values(text):
    results = {}

    for key, pattern in REGEX_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            results[key] = match.group(1)
        else:
            results[key] = "Not Found"

    return results


@app.post("/analyze")
async def analyze_report(req: ReportRequest):

    res = requests.get(req.fileUrl)
    content_type = res.headers.get("Content-Type", "")

    raw_text = ""

    # PDF case
    if "pdf" in content_type:
        pdf_bytes = res.content
        text = extract_text_with_pypdf2(pdf_bytes)

        if text.strip():
            raw_text = text
        else:
            raw_text = "Scanned PDF — OCR disabled (fitz not used)."

    # Image case
    else:
        img = Image.open(BytesIO(res.content))
        raw_text = pytesseract.image_to_string(img)

    # extract all medical values
    values = extract_medical_values(raw_text)

    return {
        "success": True,
        "extracted_values": values,
        "raw_text": raw_text
    }

# -----------------------------
# RUN APP
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
