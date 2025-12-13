import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, doctorId, amount, description, appointmentDate } =
    location.state || {};

  const [step, setStep] = useState(1); // 👈 Step control: 1=create order, 2=payment, 3=success
  const [orderID, setOrderID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const BASE_URL = "http://localhost:5000";

  // 🩺 Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`);
        setDoctor(data);
      } catch (error) {
        console.error("❌ Error fetching doctor details:", error);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (!userId || !doctorId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600">
          ⚠️ Missing Appointment Info. Please book again.
        </h2>
      </div>
    );
  }

  // 💰 Step 1: Create PayPal Order
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/paypal/create-order`, {
        amount,
        description,
        userId,
        doctorId,
      });
      setOrderID(data.id);
      setStep(2); // Move to next step (show payment button)
    } catch (error) {
      console.error("❌ Error creating PayPal order:", error);
      alert("Failed to create PayPal order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Capture PayPal Order
  const captureOrder = async (orderID) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASE_URL}/api/paypal/capture-order/${orderID}`
      );

      if (data.success) {
        // Save appointment
        await axios.post(`${BASE_URL}/api/appointments`, {
          userId,
          doctorId,
          appointmentDate,
          description,
          paymentId: orderID,
          status: "Paid",
        });

        setStep(3); // Move to success screen
      }
    } catch (error) {
      console.error("❌ Error capturing order:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🖥 UI Rendering by Step
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          {step === 1 && "Step 1️⃣: Create PayPal Order"}
          {step === 2 && "Step 2️⃣: Complete Payment"}
          {step === 3 && "✅ Payment Successful"}
        </h2>

        {/* Doctor Details */}
        <div className="text-gray-600 mb-4">
          <p>
            <b>Doctor:</b> {doctor ? doctor.name : "Fetching..."}
          </p>
          {doctor && (
            <p>
              <b>Specialization:</b> {doctor.specialization}
            </p>
          )}
          <p>
            <b>Description:</b> {description}
          </p>
          <p>
            <b>Appointment Date:</b>{" "}
            {new Date(appointmentDate).toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            <b>Total Fee:</b> ${amount}
          </p>
        </div>

        {/* Step 1: Create Order */}
        {step === 1 && (
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Creating Order..." : "Create PayPal Order"}
          </button>
        )}

        {/* Step 2: PayPal Button */}
        {step === 2 && orderID && (
          <PayPalScriptProvider
            options={{
              "client-id":
                "AfuhWoqnsFUHk5XZ-MaHFW7W5tSzyUCiug8hy3vF1ewWpbLUlktS_eb5uKMuyod3Z7cyaASRbnoKeP8V",
              currency: "USD",
            }}
          >
            <div className="mt-4">
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={() => orderID}
                onApprove={(data) => captureOrder(data.orderID)}
              />
            </div>
          </PayPalScriptProvider>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center text-green-600 font-semibold mt-4">
            ✅ Payment and Appointment Created Successfully! 🎉
            <button
              onClick={() => navigate("/user/appointments")}
              className="block mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Go to My Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
