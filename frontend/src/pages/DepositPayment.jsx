import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DepositPayment = () => {
  const { bookingId: paramBookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingId = paramBookingId || location.state?.bookingId;
  const [totalAmount, setTotalAmount] = useState(location.state?.total || 0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [paymentDone, setPaymentDone] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});

  const deposit = (totalAmount * 0.2).toFixed(2); // 20% deposit

  useEffect(() => {
    if (!bookingId) {
      alert("❌ Booking ID is missing. Redirecting to home.");
      navigate("/");
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!totalAmount && bookingId) {
      axios
        .get(`http://localhost:8000/api/bookings/${bookingId}/`)
        .then((res) => {
          setBookingDetails(res.data);
          setTotalAmount(res.data.total_price || 0);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("❌ Could not fetch booking data.");
          navigate('/');
        });
    }
  }, [bookingId, totalAmount, navigate]);

  const handlePayment = async () => {
    if (!bookingId) return alert("Booking ID missing.");
    if (!selectedMethod) return alert("Please select a payment method.");
    if (selectedMethod === "UPI" && !upiId.trim()) return alert("Please enter your UPI ID.");
    if (selectedMethod === "Debit Card") {
      const { number, expiry, cvv } = cardDetails;
      if (!number || !expiry || !cvv) return alert("Please fill all debit card details.");
    }

    try {
      const response = await axios.post('http://localhost:8000/api/payments/', {
        booking: bookingId,
        amount: deposit,
        payment_type: 'Deposit',
        status: 'Completed',
      });

      alert(`✅ Payment of ₹${deposit} via ${selectedMethod} successful!`);
      setReceiptData({
        booking: bookingDetails,
        payment: response.data,
        method: selectedMethod,
      });
      setPaymentDone(true);
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert("❌ Payment failed! Please try again.");
    }
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    const { booking, payment, method } = receiptData || {};

    doc.setFontSize(16);
    doc.text("🧾 Service Booking Receipt", 70, 15);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking?.id || bookingId}`, 14, 30);
    doc.text(`Customer: ${booking?.customer_name || 'N/A'}`, 14, 38);
    doc.text(`Email: ${booking?.email || 'N/A'}`, 14, 46);
    doc.text(`Payment Method: ${method}`, 14, 54);
    doc.text(`Payment Status: ${payment?.status}`, 14, 62);
    doc.text(`Advance Paid: ₹${payment?.amount}`, 14, 70);
    doc.text(`Total Amount: ₹${booking?.total_price}`, 14, 78);

    if (Array.isArray(booking?.services) && booking.services.length > 0) {
      const tableBody = booking.services.map((s, i) => [
        i + 1,
        s.name,
        s.description || '—',
        `₹${s.price}`,
        s.quantity || 1,
        `₹${s.price * (s.quantity || 1)}`
      ]);

      autoTable(doc, {
        startY: 88,
        head: [['#', 'Service', 'Description', 'Price', 'Qty', 'Subtotal']],
        body: tableBody,
      });
    }

    doc.text("✔ Thank you for booking with us!", 14, doc.lastAutoTable?.finalY + 15 || 120);
    doc.save(`Receipt_Booking_${bookingId}.pdf`);
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4 text-center">💳 Deposit Payment</h2>

        <p><strong>Total Price:</strong> ₹{totalAmount || "Loading..."}</p>
        <p className="text-success"><strong>Advance (20%):</strong> ₹{deposit}</p>

        {!paymentDone ? (
          <>
            <div className="form-group mt-4">
              <label><strong>Select Payment Method:</strong></label>
              {["UPI", "Debit Card", "QR Code"].map((method) => (
                <div className="form-check" key={method}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    value={method}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    checked={selectedMethod === method}
                  />
                  <label className="form-check-label">{method}</label>
                </div>
              ))}
            </div>

            {selectedMethod === "UPI" && (
              <div className="form-group mt-3">
                <label>UPI ID:</label>
                <input
                  className="form-control"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                />
              </div>
            )}

            {selectedMethod === "Debit Card" && (
              <div className="mt-3">
                <div className="form-group mb-2">
                  <label>Card Number:</label>
                  <input
                    className="form-control"
                    maxLength={16}
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="d-flex gap-3">
                  <div className="form-group flex-fill">
                    <label>Expiry:</label>
                    <input
                      className="form-control"
                      placeholder="MM/YY"
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-fill">
                    <label>CVV:</label>
                    <input
                      className="form-control"
                      maxLength={3}
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "QR Code" && (
              <div className="text-center mt-4">
                <label className="d-block mb-2">Scan QR to Pay:</label>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay"
                  alt="QR Code"
                  width={200}
                  height={200}
                />
              </div>
            )}

            <button
              onClick={handlePayment}
              className="btn btn-primary mt-4 w-100"
            >
              Pay ₹{deposit}
            </button>
          </>
        ) : (
          <div className="text-center mt-4">
            <h4 className="text-success">✅ Payment Completed</h4>
            <button className="btn btn-success mt-3" onClick={downloadReceipt}>
              Download Receipt
            </button>
            <button
              className="btn btn-secondary mt-3 ms-3"
              onClick={() => navigate('/thank-you')}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPayment;
