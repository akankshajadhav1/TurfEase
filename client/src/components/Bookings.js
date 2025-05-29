import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/bookings" } });
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setLoading(true);
      await cancelBooking(bookingId);

      // Update bookings list
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      setMessage("Booking cancelled successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error cancelling booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status, paymentStatus) => {
    if (status === "CANCELLED") return "status-cancelled";
    if (status === "COMPLETED") return "status-completed";
    if (paymentStatus === "PAID") return "status-paid";
    if (paymentStatus === "PENDING") return "status-pending";
    return "status-confirmed";
  };

  const getStatusText = (status, paymentStatus) => {
    if (status === "CANCELLED") return "Cancelled";
    if (status === "COMPLETED") return "Completed";
    if (paymentStatus === "PAID") return "Paid";
    if (paymentStatus === "PENDING") return "Payment Pending";
    return "Confirmed";
  };

  if (loading && bookings.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      style={{
        height: "1000px",
        background:
          "linear-gradient(to bottom,rgb(153, 185, 207),rgb(211, 228, 165))",
      }}
      className="bookings-container "
    >
      <h2 style={{ alignItems: "center" }}>My Bookings</h2>

      {message && <div className="success-message">{message}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <button onClick={() => navigate("/")} className="browse-button">
            Browse Turfs
          </button>
        </div>
      ) : (
        <div className="bookings-list ">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card ml-4">
              <div className="booking-header">
                <h3>{booking.turf.name}</h3>
                <span
                  className={`status-badge ${getStatusBadgeClass(
                    booking.status,
                    booking.paymentStatus
                  )}`}
                >
                  {getStatusText(booking.status, booking.paymentStatus)}
                </span>
              </div>

              <div className="booking-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(booking.startTime).toLocaleTimeString()} -{" "}
                  {new Date(booking.endTime).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Location:</strong> {booking.turf.location}
                </p>
                <p>
                  <strong>Total Cost:</strong> ₹{booking.totalCost}
                </p>
                {booking.eventName && (
                  <p>
                    <strong>Event:</strong> {booking.eventName}
                  </p>
                )}
              </div>

              <div className="booking-actions">
                {booking.status === "CONFIRMED" &&
                  booking.paymentStatus === "PENDING" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/turf/${booking.turfId}/book/payment/${booking.id}`
                        )
                      }
                      className="pay-button"
                    >
                      Pay Now
                    </button>
                  )}

                {booking.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="cancel-button"
                    disabled={loading}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
