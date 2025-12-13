const express = require('express');
const router = express.Router();

const { createRating, getDoctorRatings } = require("../controllers/rating.controller");


// Create a new rating for an appointment
router.post("/", createRating);

// Get all ratings for a specific doctor
router.get("/doctor/:doctorId", getDoctorRatings);


module.exports = router;
