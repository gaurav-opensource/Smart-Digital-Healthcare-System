import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../../Services/cloudinary.service";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a medical report");
      return;
    }

    setLoading(true);

    try {
      // Step 1 → Upload to Cloudinary
      const fileType = file.type.includes("pdf") ? "raw" : "image";
      const fileUrl = await uploadToCloudinary(file, fileType);

      console.log("Cloudinary URL:", fileUrl);

      // Step 2 → Send Cloudinary URL to Python OCR backend
      const response = await axios.post("http://localhost:8000/analyze", {
        fileUrl,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-3">Upload Medical Report</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload & Analyze
      </button>

      {loading && <p>Processing...</p>}

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Report Analysis</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadReport;
