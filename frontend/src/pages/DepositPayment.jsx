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
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const deposit = (totalAmount * 0.2).toFixed(2); // 20% deposit

  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (!bookingId) {
      alert("❌ Booking ID is missing. Redirecting to home.");
      navigate("/");
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!totalAmount && bookingId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/bookings/${bookingId}/`)
        .then((res) => {
          setBookingDetails(res.data);
          setTotalAmount(res.data.total_price || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("❌ Could not fetch booking data.");
          navigate('/');
          setLoading(false);
        });
    }
  }, [bookingId, totalAmount, navigate]);

  const validatePaymentForm = () => {
    const newErrors = {};
    
    if (!selectedMethod) {
      newErrors.method = 'Please select a payment method';
    }
    
    if (selectedMethod === "UPI" && !upiId.trim()) {
      newErrors.upi = 'Please enter your UPI ID';
    } else if (selectedMethod === "UPI" && upiId.trim() && !upiId.includes('@')) {
      newErrors.upi = 'Please enter a valid UPI ID (e.g., user@paytm)';
    }
    
    if (selectedMethod === "Debit Card") {
      const { number, expiry, cvv } = cardDetails;
      if (!number) newErrors.cardNumber = 'Card number is required';
      else if (number.length < 16) newErrors.cardNumber = 'Card number must be 16 digits';
      
      if (!expiry) newErrors.expiry = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = 'Format should be MM/YY';
      
      if (!cvv) newErrors.cvv = 'CVV is required';
      else if (cvv.length < 3) newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setProcessingPayment(true);
    setErrors({});

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post('http://localhost:8000/api/payments/', {
        booking: bookingId,
        amount: deposit,
        payment_type: 'Deposit',
        status: 'Completed',
      });

      // Success animation
      document.querySelector('.payment-form').classList.add('success-animation');
      
      setTimeout(() => {
        setReceiptData({
          booking: bookingDetails,
          payment: response.data,
          method: selectedMethod,
        });
        setPaymentDone(true);
      }, 1000);

    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      
      // Error animation
      document.querySelector('.payment-form').classList.add('error-shake');
      setTimeout(() => {
        document.querySelector('.payment-form').classList.remove('error-shake');
      }, 500);
      
      setErrors({ general: 'Payment failed! Please try again.' });
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, number: formatted.replace(/\s/g, '') });
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardDetails({ ...cardDetails, expiry: value });
    if (errors.expiry) {
      setErrors({ ...errors, expiry: '' });
    }
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    const { booking, payment, method } = receiptData || {};

    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("ServiCity", 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Receipt", 105, 30, { align: 'center' });
    
    // Add a line
    doc.setDrawColor(102, 126, 234);
    doc.line(20, 35, 190, 35);

    // Booking details
    doc.setFontSize(12);
    doc.text(`Receipt ID: #${payment?.id || Math.random().toString(36).substr(2, 9).toUpperCase()}`, 20, 50);
    doc.text(`Booking ID: ${booking?.id || bookingId}`, 20, 58);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 66);
    doc.text(`Time: ${new Date().toLocaleTimeString('en-IN')}`, 20, 74);
    
    doc.text(`Customer: ${booking?.customer_name || booking?.name || 'N/A'}`, 20, 86);
    doc.text(`Phone: ${booking?.phone || 'N/A'}`, 20, 94);
    doc.text(`Email: ${booking?.email || 'N/A'}`, 20, 102);
    
    // Payment details
    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69);
    doc.text("Payment Details", 20, 118);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Payment Method: ${method}`, 20, 130);
    doc.text(`Payment Status: ${payment?.status || 'Completed'}`, 20, 138);
    doc.text(`Advance Paid: ₹${payment?.amount || deposit}`, 20, 146);
    doc.text(`Total Amount: ₹${totalAmount}`, 20, 154);
    doc.text(`Remaining: ₹${(totalAmount - deposit).toFixed(2)}`, 20, 162);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing ServiCity!", 105, 280, { align: 'center' });
    doc.text("For support, contact: support@servicity.com | +91 98765 43210", 105, 288, { align: 'center' });

    doc.save(`ServiCity_Receipt_${bookingId}.pdf`);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h4 className="loading-text">Loading payment details...</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Payment Page */}
      <div className="payment-page">
        {/* Background Elements */}
        <div className="payment-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>

        <div className="container py-5">
          {/* Page Header */}
          <div className={`payment-header text-center mb-5 ${isVisible ? 'fade-in' : ''}`}>
            <div className="header-icon">
              <i className="bi bi-credit-card"></i>
            </div>
            <h1 className="page-title display-4 fw-bold mb-3">
              Secure <span className="gradient-text">Payment</span>
            </h1>
            <p className="page-subtitle lead text-muted">
              Complete your booking with a secure deposit payment
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              {!paymentDone ? (
                /* Payment Form */
                <div className={`payment-card ${isVisible ? 'slide-in-up' : ''}`}>
                  <div className="payment-form">
                    {/* Amount Summary */}
                    <div className="amount-summary">
                      <div className="summary-header">
                        <h4 className="summary-title">
                          <i className="bi bi-receipt me-2"></i>
                          Payment Summary
                        </h4>
                      </div>
                      
                      <div className="amount-breakdown">
                        <div className="amount-item">
                          <span className="amount-label">
                            <i className="bi bi-tag me-2"></i>
                            Total Service Amount
                          </span>
                          <span className="amount-value">₹{totalAmount || "Loading..."}</span>
                        </div>
                        
                        <div className="amount-item highlight">
                          <span className="amount-label">
                            <i className="bi bi-cash-coin me-2"></i>
                            Advance Payment (20%)
                          </span>
                          <span className="amount-value advance">₹{deposit}</span>
                        </div>
                        
                        <div className="amount-item remaining">
                          <span className="amount-label">
                            <i className="bi bi-clock me-2"></i>
                            Remaining Amount
                          </span>
                          <span className="amount-value">₹{(totalAmount - deposit).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="payment-note">
                        <i className="bi bi-info-circle me-2"></i>
                        Pay remaining amount after service completion
                      </div>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                      <div className="alert alert-danger alert-custom" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {errors.general}
                      </div>
                    )}

                    {/* Payment Methods */}
                    <div className="payment-methods">
                      <h5 className="method-title">
                        <i className="bi bi-wallet2 me-2"></i>
                        Select Payment Method
                      </h5>
                      
                      <div className="methods-grid">
                        {["UPI", "Debit Card", "QR Code"].map((method) => (
                          <div key={method} className="method-option">
                            <input
                              className="method-input"
                              type="radio"
                              name="payment"
                              id={method}
                              value={method}
                              onChange={(e) => {
                                setSelectedMethod(e.target.value);
                                if (errors.method) {
                                  setErrors({ ...errors, method: '' });
                                }
                              }}
                              checked={selectedMethod === method}
                            />
                            <label className="method-label" htmlFor={method}>
                              <div className="method-icon">
                                <i className={`bi ${
                                  method === 'UPI' ? 'bi-phone' : 
                                  method === 'Debit Card' ? 'bi-credit-card' : 
                                  'bi-qr-code'
                                }`}></i>
                              </div>
                              <div className="method-name">{method}</div>
                              <div className="method-check">
                                <i className="bi bi-check-lg"></i>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      {errors.method && (
                        <div className="error-message">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.method}
                        </div>
                      )}
                    </div>

                    {/* UPI Details */}
                    {selectedMethod === "UPI" && (
                      <div className="payment-details upi-details slide-down">
                        <h6 className="details-title">
                          <i className="bi bi-phone me-2"></i>
                          UPI Payment Details
                        </h6>
                        
                        <div className="form-group">
                          <div className="input-wrapper">
                            <div className="input-icon">
                              <i className="bi bi-at"></i>
                            </div>
                            <input
                              className={`form-control custom-input ${errors.upi ? 'is-invalid' : ''}`}
                              type="text"
                              placeholder="Enter your UPI ID (e.g., user@paytm)"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                if (errors.upi) {
                                  setErrors({ ...errors, upi: '' });
                                }
                              }}
                            />
                            <div className="input-line"></div>
                          </div>
                          {errors.upi && (
                            <div className="error-message">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.upi}
                            </div>
                          )}
                        </div>

                        <div className="upi-apps">
                          <p className="apps-title">Popular UPI Apps:</p>
                          <div className="apps-list">
                            <span className="app-badge" onClick={() => setUpiId(upiId.replace(/@.*/, '@paytm'))}>
                              Paytm
                            </span>
                            <span className="app-badge" onClick={() => setUpiId(upiId.replace(/@.*/, '@ybl'))}>
                              PhonePe
                            </span>
                            <span className="app-badge" onClick={() => setUpiId(upiId.replace(/@.*/, '@okaxis'))}>
                              Google Pay
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Details */}
                    {selectedMethod === "Debit Card" && (
                      <div className="payment-details card-details slide-down">
                        <h6 className="details-title">
                          <i className="bi bi-credit-card me-2"></i>
                          Card Payment Details
                        </h6>
                        
                        <div className="card-form">
                          <div className="form-group">
                            <label className="form-label">Card Number</label>
                            <div className="input-wrapper">
                              <div className="input-icon">
                                <i className="bi bi-credit-card"></i>
                              </div>
                              <input
                                className={`form-control custom-input ${errors.cardNumber ? 'is-invalid' : ''}`}
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formatCardNumber(cardDetails.number)}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                              />
                              <div className="input-line"></div>
                            </div>
                            {errors.cardNumber && (
                              <div className="error-message">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.cardNumber}
                              </div>
                            )}
                          </div>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="form-label">Expiry Date</label>
                                <div className="input-wrapper">
                                  <div className="input-icon">
                                    <i className="bi bi-calendar3"></i>
                                  </div>
                                  <input
                                    className={`form-control custom-input ${errors.expiry ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                  />
                                  <div className="input-line"></div>
                                </div>
                                {errors.expiry && (
                                  <div className="error-message">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {errors.expiry}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="form-label">CVV</label>
                                <div className="input-wrapper">
                                  <div className="input-icon">
                                    <i className="bi bi-shield-lock"></i>
                                  </div>
                                  <input
                                    className={`form-control custom-input ${errors.cvv ? 'is-invalid' : ''}`}
                                    type="password"
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={(e) => {
                                      setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') });
                                      if (errors.cvv) {
                                        setErrors({ ...errors, cvv: '' });
                                      }
                                    }}
                                    maxLength={3}
                                  />
                                  <div className="input-line"></div>
                                </div>
                                {errors.cvv && (
                                  <div className="error-message">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {errors.cvv}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="card-security">
                            <i className="bi bi-shield-check me-2"></i>
                            Your card details are secure and encrypted
                          </div>
                        </div>
                      </div>
                    )}

                    {/* QR Code */}
                    {selectedMethod === "QR Code" && (
                      <div className="payment-details qr-details slide-down">
                        <h6 className="details-title">
                          <i className="bi bi-qr-code me-2"></i>
                          Scan QR Code to Pay
                        </h6>
                        
                        <div className="qr-container">
                          <div className="qr-wrapper">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=ServiCity&am=${deposit}&cu=INR`}
                              alt="QR Code"
                              className="qr-image"
                            />
                            <div className="qr-amount">₹{deposit}</div>
                          </div>
                          
                          <div className="qr-instructions">
                            <h6>How to pay:</h6>
                            <ol>
                              <li>Open any UPI app</li>
                              <li>Scan the QR code above</li>
                              <li>Verify amount ₹{deposit}</li>
                              <li>Complete the payment</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pay Button */}
                    <div className="payment-action">
                      <button
                        onClick={handlePayment}
                        className="btn btn-pay"
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>
                            Pay ₹{deposit} Securely
                          </>
                        )}
                        <div className="btn-ripple"></div>
                      </button>

                      <div className="security-badges">
                        <div className="security-badge">
                          <i className="bi bi-shield-fill-check"></i>
                          <span>SSL Secured</span>
                        </div>
                        <div className="security-badge">
                          <i className="bi bi-lock-fill"></i>
                          <span>256-bit Encryption</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Success Screen */
                <div className={`success-card ${paymentDone ? 'fade-in' : ''}`}>
                  <div className="success-content">
                    <div className="success-animation">
                      <div className="checkmark-wrapper">
                        <div className="checkmark">
                          <i className="bi bi-check-lg"></i>
                        </div>
                      </div>
                    </div>

                    <h2 className="success-title">Payment Successful!</h2>
                    <p className="success-message">
                      Your advance payment of <strong>₹{deposit}</strong> has been processed successfully.
                    </p>

                    <div className="success-details">
                      <div className="detail-item">
                        <i className="bi bi-receipt"></i>
                        <span>Booking ID: #{bookingId}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-credit-card"></i>
                        <span>Payment Method: {receiptData?.method}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-calendar-check"></i>
                        <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="success-actions">
                      <button 
                        className="btn btn-download" 
                        onClick={downloadReceipt}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download Receipt
                      </button>
                      
                      <button
                        className="btn btn-continue"
                        onClick={() => navigate('/')}
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Continue
                      </button>
                    </div>

                    <div className="next-steps">
                      <h6>What's Next?</h6>
                      <ul>
                        <li>You'll receive a confirmation SMS/Email</li>
                        <li>Our service provider will contact you</li>
                        <li>Pay remaining amount after service completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        /* Payment Page */
        .payment-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
        }

        /* Loading Page */
        .loading-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-container {
          text-align: center;
          color: white;
        }

        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 10px;
          left: 10px;
          animation-delay: -0.3s;
        }

        .spinner-ring:nth-child(3) {
          width: 40px;
          height: 40px;
          top: 20px;
          left: 20px;
          animation-delay: -0.6s;
        }

        /* Background Shapes */
        .payment-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          animation: floatUpDown 8s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: -3s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 15%;
          animation-delay: -6s;
        }

        /* Header */
        .payment-header {
          position: relative;
          z-index: 2;
        }

        .header-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          animation: headerIconPulse 2s ease-in-out infinite;
        }

        .header-icon i {
          font-size: 2.5rem;
          color: white;
        }

        .page-title {
          color: #333;
        }

        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Payment Card */
        .payment-card {
          background: white;
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
          z-index: 2;
        }

        .payment-form {
          padding: 2rem;
        }

        /* Amount Summary */
        .amount-summary {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
        }

        .summary-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .summary-title {
          color: #333;
          font-weight: 700;
          margin: 0;
        }

        .amount-breakdown {
          margin-bottom: 1rem;
        }

        .amount-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .amount-item:last-child {
          border-bottom: none;
        }

        .amount-item.highlight {
          background: rgba(40, 167, 69, 0.1);
          padding: 1rem;
          border-radius: 10px;
          border: 2px solid rgba(40, 167, 69, 0.3);
        }

        .amount-item.remaining {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .amount-label {
          font-weight: 600;
          color: #555;
        }

        .amount-value {
          font-weight: 700;
          font-size: 1.1rem;
          color: #333;
        }

        .amount-value.advance {
          color: #28a745;
          font-size: 1.3rem;
        }

        .payment-note {
          background: rgba(23, 162, 184, 0.1);
          color: #17a2b8;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          font-weight: 600;
          border: 1px solid rgba(23, 162, 184, 0.3);
        }

        /* Error Alert */
        .alert-custom {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 15px;
          margin-bottom: 1.5rem;
        }

        /* Payment Methods */
        .payment-methods {
          margin-bottom: 2rem;
        }

        .method-title {
          color: #333;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .method-option {
          position: relative;
        }

        .method-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .method-label {
          display: block;
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 15px;
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .method-label:hover {
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .method-input:checked + .method-label {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .method-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #667eea;
        }

        .method-input:checked + .method-label .method-icon {
          color: white;
        }

        .method-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .method-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .method-input:checked + .method-label .method-check {
          opacity: 1;
          transform: scale(1);
        }

        /* Payment Details */
        .payment-details {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
          border-left: 4px solid #667eea;
        }

        .details-title {
          color: #333;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          color: #555;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .input-wrapper {
          position: relative;
        }

        .custom-input {
          background: white;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 15px;
          padding: 1rem 1rem 1rem 3.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .custom-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          transform: translateY(-2px);
          outline: none;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          font-size: 1.2rem;
          z-index: 2;
        }

        .input-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .custom-input:focus ~ .input-line {
          width: 100%;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        /* UPI Details */
        .upi-apps {
          margin-top: 1rem;
        }

        .apps-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #555;
        }

        .apps-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .app-badge {
          background: #667eea;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-badge:hover {
          background: #764ba2;
          transform: translateY(-2px);
        }

        /* Card Details */
        .card-security {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          font-weight: 600;
          margin-top: 1rem;
        }

        /* QR Details */
        .qr-container {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .qr-wrapper {
          position: relative;
          text-align: center;
        }

        .qr-image {
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .qr-amount {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #28a745;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .qr-instructions {
          flex: 1;
        }

        .qr-instructions h6 {
          color: #333;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .qr-instructions ol {
          color: #555;
        }

        .qr-instructions li {
          margin-bottom: 0.5rem;
        }

        /* Payment Action */
        .payment-action {
          text-align: center;
        }

        .btn-pay {
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
          color: white;
          padding: 1rem 3rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1.2rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          width: 100%;
          margin-bottom: 2rem;
        }

        .btn-pay:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(40, 167, 69, 0.4);
          color: white;
        }

        .btn-pay:disabled {
          opacity: 0.7;
        }

        .btn-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-pay:active .btn-ripple {
          width: 300px;
          height: 300px;
        }

        .security-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #28a745;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Success Card */
        .success-card {
          background: white;
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          padding: 3rem 2rem;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .success-animation {
          margin-bottom: 2rem;
        }

        .checkmark-wrapper {
          position: relative;
          display: inline-block;
        }

        .checkmark {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #28a745, #20c997);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
          animation: checkmarkBounce 1s ease-out;
        }

        .success-title {
          color: #28a745;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .success-message {
          color: #555;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .success-details {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #555;
          font-weight: 600;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-item i {
          color: #667eea;
          font-size: 1.2rem;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .btn-download {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-download:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-continue {
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-continue:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(40, 167, 69, 0.4);
          color: white;
        }

        .next-steps {
          background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: left;
        }

        .next-steps h6 {
          color: #333;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }

        .next-steps ul {
          color: #555;
          margin: 0;
        }

        .next-steps li {
          margin-bottom: 0.5rem;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes headerIconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes checkmarkBounce {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { opacity: 0; height: 0; }
          to { opacity: 1; height: auto; }
        }

        .success-animation {
          animation: successPulse 0.5s ease-in-out;
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .error-shake {
          animation: errorShake 0.5s ease-in-out;
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .fade-in {
          animation: fade-in 0.8s ease-out both;
        }

        .slide-in-up {
          animation: slide-in-up 0.8s ease-out both;
        }

        .slide-down {
          animation: slide-down 0.5s ease-out both;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .header-icon {
            width: 60px;
            height: 60px;
          }

          .header-icon i {
            font-size: 2rem;
          }

          .payment-form {
            padding: 1.5rem;
          }

          .amount-summary {
            padding: 1.5rem;
          }

          .methods-grid {
            grid-template-columns: 1fr;
          }

          .qr-container {
            flex-direction: column;
            text-align: center;
          }

          .success-actions {
            flex-direction: column;
          }

          .btn-download,
          .btn-continue {
            width: 100%;
          }

          .security-badges {
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default DepositPayment;
