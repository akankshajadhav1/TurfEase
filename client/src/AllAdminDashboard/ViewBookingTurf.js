import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/ViewBookingTurf.css"; // We'll style it nicely
// import AdminNavComponents from "./AdminNavComponents";

const ViewBookingTurf = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAdminBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token); // Debug print

      const response = await axios.get(
        "http://localhost:5000/api/bookings/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Bookings data:", response.data); // Debug print
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  return (
    <div>
      {/* <AdminNavComponents /> */}
      <div
        style={{
          background:
            "linear-gradient(to right,rgb(176, 224, 160),rgb(212, 229, 154))",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h2 style={{ alignItems: "center" }}>All Turf Bookings </h2>

        {loading && <p>Loading bookings...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="admin-bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="admin-booking-card">
              <h3>{booking.turf?.name || "Turf"}</h3>
              <p>
                <strong>Booked By:</strong>{" "}
                {booking.user?.name || "Unknown User"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewBookingTurf;
