import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StripeProvider } from "./context/StripeContext";

// Components
import Navbar from "./components/Navbar";

import Login from "./components/Login";
import Register from "./components/Register";
import BookingForm from "./components/BookingForm";
import PaymentPage from "./components/PaymentPage";
import Bookings from "./components/Bookings";
import PaymentSuccess from "./components/PaymentSuccess";

// Styles
import "./App.css";

import UserHome from "./components/UserHome";
import TurfCard from "./components/TurfCard";
import GetAllTurf from "./components/GetAllTurf";
import TurfDetail from "./components/TurfDetail";
import Dashboard from "./components/Dashboard";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import FooterComponent from "./components/FooterComponent";
import AdminDashboard from "./AllAdminDashboard/AdminDashboard";
import AddTurf from "./AllAdminDashboard/AddTurf";
import ViewBookingTurf from "./AllAdminDashboard/ViewBookingTurf";
import ViewTurf from "./AllAdminDashboard/ViewTurf";
import UpdateTurf from "./AllAdminDashboard/UpdateTurf";

function App() {
  return (
    <Router>
      <AuthProvider>
        <StripeProvider>
          <div className="">
            <Navbar />
            <main className="">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<UserHome />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/footer" element={<FooterComponent />} />
                <Route path="/turfCard" element={<TurfCard />} />
                <Route path="/userHome" element={<UserHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/turf/:turfId/book" element={<BookingForm />} />
                <Route path="/payment/:bookingId" element={<PaymentPage />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/getAllTurf" element={<GetAllTurf />} />
                <Route path="/turfs/:id" element={<TurfDetail />} />
                {/* Admin */}
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/updateTurf/:id" element={<UpdateTurf />} />
                {/* <Route path="/turfs/${turf.id}" element={<AdminTurfDetail />} /> */}
                <Route path="/addTurfs" element={<AddTurf />} />
                <Route path="/viewbookingTurf" element={<ViewBookingTurf />} />
                <Route path="/viewTurf" element={<ViewTurf />} />
              </Routes>
            </main>
          </div>
        </StripeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
