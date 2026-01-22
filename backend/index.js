const express = require("express");
const cors = require("cors");
const axios = require("axios");

require('dotenv').config();
const logger = require('./utils/logger'); 

// Routes
const AdminRoute = require('./routes/admin.routes');
const UserRoute = require('./routes/users.routes');
const DoctorRoute = require('./routes/doctors.routes');
const AppoinmentRoute = require('./routes/appointment.route');
const PaymentRoute = require('./routes/payments.routes');
const RatingRoute = require('./routes/ratings.routes');
const emailRoute= require('./routes/email.routes');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Database
connectDB()
  .then(() => logger.info('Database connected successfully'))
  .catch((err) => logger.error('Database connection failed:', err.message));

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

const frontendUrl = "https://smart-digital-healthcare-system.onrender.com/";

// Routes
app.use('/api/admin', AdminRoute);
app.use('/api/users', UserRoute);
app.use('/api/doctors', DoctorRoute);
app.use('/api/appointments', AppoinmentRoute);
app.use('/api/paypal', PaymentRoute);
app.use('/api/ratings', RatingRoute);
app.use('/api/send', emailRoute);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


// Report Analysis Endpoint
app.post("/api/report/analyze", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    console.log("📥 File URL received:", fileUrl);

    const response = await axios.post(
      "http://localhost:8000/analyze",
      { fileUrl }
    );

    console.log("✅ Report analysis successful:", response.data);
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


app.use((err, req, res, next) => {
  logger.error(`${err.message}`);
  res.status(500).json({ message: 'Something went wrong' });
});


const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
