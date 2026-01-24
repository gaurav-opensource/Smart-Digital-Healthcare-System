import { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { motion } from "framer-motion";
import { Loader2, FileUp, Brain } from "lucide-react";
import BASE_URL from "../api/api";

function RiskPredictPage() {
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
        `${BASE_URL}/report/analyze`,
        { fileUrl: pdfUrl }
      );

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-green-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          w-full
          min-h-screen
          bg-white
          px-4
          sm:px-6
          md:px-10
          lg:px-16
          py-10
        "
      >
        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            AI Medical Report Analysis
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Upload your medical report (PDF) to get risk & doctor suggestions
          </p>
        </div>

        {/* ================= FILE INPUT ================= */}
        <div className="max-w-2xl mx-auto">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-xl p-3"
          />

          {/* ================= BUTTON ================= */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="
              mt-4
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              flex
              justify-center
              items-center
              gap-2
              font-semibold
              transition
            "
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileUp />}
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {/* ================= RESULT ================= */}
        {result && (
          <>
            {/* ================= RISK LEVEL ================= */}
            {result?.risk_level && (
              <div
                className={`mt-10 max-w-3xl mx-auto border rounded-2xl p-6 text-center font-semibold text-lg ${getRiskStyles(
                  result.risk_level
                )}`}
              >
                <p>
                  Overall Health Risk Level:
                  <span className="ml-2 text-xl font-bold">
                    {result.risk_level}
                  </span>
                </p>

                <p className="text-sm mt-2">
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
                <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 text-center">
                  Report Analysis Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                      <p className="text-gray-500 text-sm">
                        {item.parameter}
                      </p>

                      <p
                        className={`text-xl font-bold mt-1 ${
                          item.status === "Normal"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.value}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Normal Range: {item.normal_range}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-8">
                No readable medical values found in this report.
              </p>
            )}

            {/* ================= SPECIALIST ================= */}
            {result?.specialist_suggestion && (
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => {
                    window.location.href = `/doctors?specialist=${encodeURIComponent(
                      result.specialist_suggestion
                    )}&sort=best`;
                  }}
                  className="
                    mt-10
                    w-full
                    bg-gradient-to-r from-purple-600 to-indigo-600
                    hover:from-purple-700 hover:to-indigo-700
                    text-white
                    py-4
                    rounded-2xl
                    text-lg
                    font-bold
                    shadow-lg
                    transition-all
                    duration-300
                  "
                >
                  🔍 Find Best {result.specialist_suggestion} Doctors
                </button>
              </div>
            )}

            {/* ================= DOCTOR MESSAGE ================= */}
            {result?.doctor_suggestion && (
              <p className="mt-6 text-gray-600 italic text-center">
                {result.doctor_suggestion}
              </p>
            )}
          </>
        )}

        {/* ================= FOOTER ================= */}
        <p className="text-gray-500 text-sm mt-16 text-center">
          Powered by{" "}
          <span className="font-semibold text-blue-600">
            AI Smart Healthcare
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default RiskPredictPage;
