import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../Services/cloudinary.service";
import { motion } from "framer-motion";
import { Loader2, FileUp, Brain, HeartPulse } from "lucide-react";

function DiseasePredictPage() {

  // ---------------- PDF State ----------------
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- Heart State ----------------
  const [heartData, setHeartData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: ""
  });

  const [heartResult, setHeartResult] = useState(null);
  const [heartLoading, setHeartLoading] = useState(false);

  // ---------------- PDF Upload Logic ----------------
  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setResult(null);

    try {
      const pdfUrl = await uploadToCloudinary(file, "pdf");

      const { data } = await axios.post("http://localhost:5000/api/report/analyze", {
        fileUrl: pdfUrl,
      });

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing the report");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Heart Prediction Logic ----------------
  const handleHeartPredict = async () => {
    setHeartLoading(true);
    setHeartResult(null);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/p",
        heartData
      );

      setHeartResult(data.result);
    } catch (error) {
      console.error(error);
      alert("Error predicting heart disease");
    } finally {
      setHeartLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center p-6">

      {/* MAIN WRAPPER */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        {/* ========================= CARD 1 – PDF ANALYZER ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200"
        >
          <div className="text-center mb-4">
            <Brain className="text-blue-600 w-12 h-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">AI Report Analyzer</h1>
            <p className="text-gray-500 text-sm">Upload your medical report (PDF)</p>
          </div>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileUp />}
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>

          {/* SAFE DISPLAY OF EXTRACTED VALUES */}
          {result?.extracted_values && (
            <div className="mt-5 bg-green-50 border border-green-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                Extracted Medical Values
              </h2>

              <ul className="list-disc ml-6 text-gray-700">
                {Object.entries(result.extracted_values).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* ========================= CARD 2 – HEART PREDICTION ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200"
        >
          <div className="text-center mb-4">
            <HeartPulse className="text-red-600 w-12 h-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">Heart Disease Prediction</h1>
            <p className="text-gray-500 text-sm">Enter patient details</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.keys(heartData).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={heartData[key]}
                onChange={(e) =>
                  setHeartData({ ...heartData, [key]: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-sm"
              />
            ))}
          </div>

          <button
            onClick={handleHeartPredict}
            disabled={heartLoading}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
          >
            {heartLoading ? <Loader2 className="animate-spin" /> : <HeartPulse />}
            {heartLoading ? "Predicting..." : "Predict Heart Disease"}
          </button>

          {heartResult !== null && (
            <div className="mt-5 bg-red-50 border border-red-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Prediction Result
              </h2>

              <p className="text-gray-700 text-lg">
                {heartResult === 1
                  ? "⚠ High Risk of Heart Disease!"
                  : "✔ No Major Risk Detected"}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <p className="text-gray-500 text-sm mt-6">
        Powered by <span className="font-semibold text-blue-600">AI Smart Healthcare</span>
      </p>
    </div>
  );
}

export default DiseasePredictPage;
