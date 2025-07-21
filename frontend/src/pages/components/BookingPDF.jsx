// BookingPDF.jsx
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BookingPDF = ({ booking }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("🧾 Service Booking Receipt", 70, 15);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking?.id || 'N/A'}`, 14, 30);
    doc.text(`Customer: ${booking?.customer_name || 'N/A'}`, 14, 38);
    doc.text(`Email: ${booking?.email || 'N/A'}`, 14, 46);
    doc.text(`Payment Method: ${booking?.payment_method || 'N/A'}`, 14, 54);
    doc.text(`Payment Status: ${booking?.payment_status || 'N/A'}`, 14, 62);
    doc.text(`Advance Paid: ₹${booking?.advance_paid || 0}`, 14, 70);
    doc.text(`Total Amount: ₹${booking?.total_amount || 0}`, 14, 78);

    // Services Table
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
    doc.save(`Receipt_Booking_${booking?.id || 'booking'}.pdf`);
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={downloadPDF}
        className="btn btn-success mt-3"
      >
        📄 Download Receipt
      </button>
    </div>
  );
};

export default BookingPDF;
