import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../api/api";

const PaymentPage = ({ appointmentId, doctorId, userId }) => {
  const [userCardNumber, setUserCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [doctorName, setDoctorName] = useState("");

  // fetch doctor details (optional)
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/doctors/${doctorId}`);
        if (res.data.success) setDoctorName(res.data.doctor.name);
        // you can also fetch amount from appointment if dynamic
        setAmount(res.data.doctor.fees || 100); // default 100
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handlePayment = async () => {
    if (!userCardNumber || !expiry || !cvv) {
      alert("Please fill all card details");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/payment/pay-appointment`, {
        appointmentId,
        doctorId,
        userId,
        userCardNumber,
        expiry,
        cvv,
        amount,
      });

      if (res.data.success) {
        setPaymentResult({
          status: "Success",
          transactionId: res.data.transactionId,
          doctorBalance: res.data.doctorBalance,
        });
      } else {
        setPaymentResult({
          status: "Failed",
          transactionId: res.data.transactionId,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Pay Appointment Fee</h2>
      <p className="mb-2"><strong>Doctor:</strong> {doctorName}</p>
      <p className="mb-4"><strong>Amount:</strong> ₹{amount}</p>

      <div className="mb-3">
        <label className="block mb-1">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={userCardNumber}
          onChange={(e) => setUserCardNumber(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Expiry (MM/YY)</label>
        <input
          type="text"
          placeholder="08/25"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">CVV</label>
        <input
          type="password"
          placeholder="123"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {paymentResult && (
        <div className={`mt-4 p-2 rounded ${paymentResult.status === "Success" ? "bg-green-100" : "bg-red-100"}`}>
          <p><strong>Payment Status:</strong> {paymentResult.status}</p>
          <p><strong>Transaction ID:</strong> {paymentResult.transactionId}</p>
          {paymentResult.doctorBalance && <p><strong>Doctor Balance:</strong> ₹{paymentResult.doctorBalance}</p>}
        </div>
      )}
    </div>
  );
}

export default PaymentPage;