import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../Services/cloudinary.service";
import { motion } from "framer-motion";
import { Loader2, FileUp, Brain } from "lucide-react";

function DiseasePredictPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= Upload & Analyze =================
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const pdfUrl = await uploadToCloudinary(file, "pdf");

      const { data } = await axios.post(
        "http://localhost:5000/api/report/analyze",
        { fileUrl: pdfUrl }
      );

      console.log("Frontend received:", data);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error while analyzing report");
    } finally {
      setLoading(false);
    }
  };

  // ================= Risk Color =================
  const getRiskStyles = (risk) => {
    if (risk === "High Risk")
      return "bg-red-100 text-red-700 border-red-300";
    if (risk === "Medium Risk")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-green-100 text-green-700 border-green-300";
  };

  // ================= Filter Not Found =================
  const filteredResults =
    result?.report_analysis?.filter(
      (item) => item.value && item.value !== "Not Found"
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8"
      >
        {/* ================= HEADER ================= */}
        <div className="text-center mb-6">
          <Brain className="w-14 h-14 text-blue-600 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">
            AI Medical Report Analysis
          </h1>
          <p className="text-gray-500 text-sm">
            Upload your medical report (PDF)
          </p>
        </div>

        {/* ================= FILE INPUT ================= */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border border-gray-300 rounded-lg p-2"
        />

        {/* ================= BUTTON ================= */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileUp />}
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {/* ================= RESULT ================= */}
        {result && (
          <>
            {/* ================= RISK LEVEL ================= */}
            {result?.risk_level && (
              <div
                className={`mt-6 mb-6 border rounded-xl p-5 text-center font-semibold text-lg ${getRiskStyles(
                  result.risk_level
                )}`}
              >
                <p>
                  Overall Health Risk Level:
                  <span className="ml-2 text-xl font-bold">
                    {result.risk_level}
                  </span>
                </p>

                <p className="text-sm mt-1">
                  Abnormal Parameters Detected:{" "}
                  <span className="font-bold">
                    {result.abnormal_parameters}
                  </span>
                </p>
              </div>
            )}

            {/* ================= REPORT DETAILS ================= */}
            {filteredResults.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center">
                  Report Analysis Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {filteredResults.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <p className="text-gray-500 text-sm">
                        {item.parameter}
                      </p>

                      <p
                        className={`text-xl font-bold ${
                          item.status === "Normal"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.value}
                      </p>

                      <p className="text-xs text-gray-400">
                        Normal Range: {item.normal_range}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No readable medical values found in this report.
              </p>
            )}

            {/* ================= SPECIALIST ================= */}
            {result?.specialist_suggestion && (
              <button
                onClick={() =>
                  window.location.href = `/doctors?specialist=${encodeURIComponent(
                    result.specialist_suggestion
                  )}`
                }
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition-all"
              >
                🔍 Find Doctors for {result.specialist_suggestion}
              </button>
            )}
            {/* ================= DOCTOR MESSAGE ================= */}
            {result?.doctor_suggestion && (
              <p className="mt-4 text-gray-600 italic text-center">
                {result.doctor_suggestion}
              </p>
            )}
          </>
        )}
      </motion.div>

      <p className="text-gray-500 text-sm mt-6">
        Powered by{" "}
        <span className="font-semibold text-blue-600">
          AI Smart Healthcare
        </span>
      </p>
    </div>
  );
}

export default DiseasePredictPage;
