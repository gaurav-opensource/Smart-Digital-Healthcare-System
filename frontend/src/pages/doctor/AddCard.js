import { useState } from "react";
import axios from "axios";

import BASE_URL from '../../api/api';

export default function AddDoctorCard({ doctorId }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleAddCard = async () => {
  setLoading(true);
  try {
    const res = await axios.post(`${BASE_URL}/payment/doctor/add-card`, 
      { cardNumber, expiry, cvv }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('doctorToken')}` } }
    );

    if(res.data.success){
      alert("Card added successfully!");
      setToken(res.data.cardToken);
    } else {
      alert("Error: " + res.data.message);
    }
  } catch(err){
    console.error(err);
    alert("Failed to add card");
  }
  setLoading(false);
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Your Card</h2>

      <div className="mb-3">
        <label className="block mb-1">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
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
        onClick={handleAddCard}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Saving..." : "Add Card"}
      </button>

      {token && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <p>Mock Token generated: <strong>{token}</strong></p>
          <p>Use this token for user payments (mock RozgarPay)</p>
        </div>
      )}
    </div>
  );
}
