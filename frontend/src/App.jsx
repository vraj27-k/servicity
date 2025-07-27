import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ForgotPassword from "./ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookService from "./pages/BookService";
import ConfirmBooking from "./pages/ConfirmBooking";
import DepositPayment from "./pages/DepositPayment"; // ✅ Correct import
import AdminLogin from './pages/components/AdminLogin';
import AdminDashboard from './pages/components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book/:id" element={<BookService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/confirm-booking/:id" element={<ConfirmBooking />} />
        <Route path="/payment/deposit/:bookingId" element={<DepositPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
