const Rating = require('../models/rating.model');
const Appointment = require('../models/appointment.model');



//Create Rating for a Completed Appointment 
exports.createRating = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    console.log('Request body:', req.body);


    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor')
      .populate('user');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const alreadyRated = await Rating.findOne({ appointment: appointmentId });
    if (alreadyRated) {
      return res.status(400).json({ message: 'Already rated' });
    }

    const newRating = new Rating({
      doctor: appointment.doctor._id,
      user: appointment.user._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    await newRating.save();

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error("Error in createRating:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//Get All Ratings for a Specific Doctor
exports.getDoctorRatings = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const ratings = await Rating.find({ doctor: doctorId })
      .populate("user", "name")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error in getDoctorRatings:", error);
    res.status(500).json({ message: "Server error" });
  }
};