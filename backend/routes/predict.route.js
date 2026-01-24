const express = require('express');
const router = express.Router();
const axios = require("axios");

// Report Analysis Endpoint
router.post("/analyze", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    console.log("📥 File URL received:", fileUrl);

    const response = await axios.post(
      "https://smart-digital-healthcare-system-service.onrender.com/analyze",
      { fileUrl }
    );

    return res.json({
      success: true,
      risk_level: response.data.risk_level,
      abnormal_parameters: response.data.abnormal_parameters,
      report_analysis: response.data.report_analysis,
      specialist_suggestion: response.data.specialist_suggestion,
      doctor_suggestion: response.data.doctor_suggestion
    });

  } catch (error) {
    console.error("❌ Report analyzer error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Error analyzing report"
    });
  }
});



// Export the router
module.exports = router;
