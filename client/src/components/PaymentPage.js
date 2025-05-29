import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserBookings } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PaymentForm from "./PaymentForm";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `/turf/book/payment/${bookingId}` },
      });
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await getUserBookings();
        const foundBooking = response.data.find(
          (b) => b.id === Number(bookingId)
        );

        if (!foundBooking) {
          setError("Booking not found");
          setLoading(false);
          return;
        }

        if (foundBooking.paymentStatus === "PAID") {
          setError("This booking has already been paid");
          setLoading(false);
          return;
        }

        setBooking(foundBooking);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isAuthenticated, navigate]);

  const handlePaymentSuccess = (updatedBooking) => {
    navigate("/bookings", {
      state: {
        message: "Payment successful! Your booking is now confirmed.",
        booking: updatedBooking,
      },
    });
  };

  const handlePaymentError = (err) => {
    setError(err.message || "Payment failed");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/bookings")} className="back-button">
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return <div className="error">Booking not found</div>;
  }

  return (
    <div className="payment-page-container">
      <h2>Complete Payment</h2>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p>
          <strong>Turf:</strong> {booking.turf.name}
        </p>
        <p>
          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
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
      </div>

      <PaymentForm
        booking={booking}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default PaymentPage;
