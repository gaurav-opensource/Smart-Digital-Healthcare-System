import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../api/api";

const UploadTestReport = ({ appointmentId, onUploadSuccess }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a PDF file only.");
    }
  };

  const uploadPdfToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dznnyaj0z");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload",
      formData
    );

    return res.data.secure_url;
  };

  const handleUpload = async () => {
    if (!pdfFile) return alert("Please select a PDF file.");
    try {
      setUploading(true);
      const pdfUrl = await uploadPdfToCloudinary();

      await axios.put(
        `${BASE_URL}/appointments/${appointmentId}/test-report`,
        { testUpload: pdfUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("PDF uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="ml-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadTestReport;
