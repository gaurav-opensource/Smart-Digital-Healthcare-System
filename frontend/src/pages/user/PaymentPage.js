import { useState } from "react";
import { CheckCircle } from "lucide-react";

const PaymentPageShowcase = () => {
  const [paid, setPaid] = useState(false);

  // 🔹 Dummy data (sirf show ke liye)
  const doctor = {
    name: "Dr. Nisha Yadav",
    specialization: "Orthopedics",
  };

  const appointment = {
  description: "Heart checkup consultation",
  date: new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
  amount: 500,
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          💳 Payment Page
        </h2>

        {/* Doctor Details */}
        <div className="mb-4 text-gray-600">
          <p><b>Doctor:</b> {doctor.name}</p>
          <p><b>Specialization:</b> {doctor.specialization}</p>
          <p><b>Reason:</b> {appointment.description}</p>
          <p><b>Appointment Date:</b> {appointment.date}</p>
        </div>

        {/* Amount */}
        <div className="text-lg font-semibold text-gray-800 mb-6">
          Total Amount: ₹{appointment.amount}
        </div>

        {/* Fake Payment Button */}
        {!paid ? (
          <button
            onClick={() => setPaid(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Pay with PayPal (Demo)
          </button>
        ) : (
          <div className="text-center text-green-600 mt-4">
            <CheckCircle size={48} className="mx-auto mb-2" />
            <p className="font-semibold">
              Payment Successful (Demo)
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Appointment Confirmed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPageShowcase;
