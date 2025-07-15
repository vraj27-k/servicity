import { Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ForgotPassword from "./ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import UserServices from "./pages/UserServices";
import AddServiceForm from "./pages/AddServiceModal";
import BookService from "./pages/BookService";
import ConfirmBooking from "./pages/ConfirmBooking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
   <Route path="/book/:id" element={<BookService />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/add-service" element={<AddServiceForm />} />
      <Route path="/services" element={<UserServices />} />
 <Route path="/confirm-booking/:id" element={<ConfirmBooking />} />
   

    </Routes>

  );
}

export default App;
