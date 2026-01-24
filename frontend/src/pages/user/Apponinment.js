import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/api";

const AppointmentForm = () => {
  const { doctorId } = useParams();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleNext = async (e) => {
    e.preventDefault();

    if (!appointmentDate || !description) {
      alert("Please fill all fields!");
      return;
    }

    const appointmentData = {
      userId,
      doctorId,
      appointmentDate,
      description,
      amount: 100, // static amount for demo
    };


    try {
      const res = await axios.post(
        `${BASE_URL}/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✔️ Appointment Created:", res.data);
      alert("Appointment created successfully!");


      navigate("/user/payment");
    } catch (error) {
      console.error("❌ Error creating appointment:", error);
      alert(error.response?.data?.message || "Failed to create appointment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20px">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-auto mt-16">
        <div className="flex items-center justify-center mb-8">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
          <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date & Time:
            </label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="w-full px-3 py-2 border-b-2 border-gray-300 rounded-md focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-3 py-2 border-b-2 border-gray-300 rounded-md resize-y focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-105 transition-all"
          >
            Continue (Create Appointment)
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
