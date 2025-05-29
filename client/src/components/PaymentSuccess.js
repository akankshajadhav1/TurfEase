import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  useEffect(() => {
    // Redirect to bookings page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/bookings", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Invalid Time";
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  if (!bookingDetails) {
    return (
      <div className="payment-success-container">
        <h2>Payment Successful!</h2>
        <p>Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <div className="booking-details">
        <h3>Booking Confirmed</h3>
        <p>
          <strong>Turf:</strong> {bookingDetails.turfName}
        </p>
        <p>
          <strong>Date:</strong> {formatDate(bookingDetails.date)}
        </p>
        <p>
          <strong>Time:</strong> {formatTime(bookingDetails.startTime)} -{" "}
          {formatTime(bookingDetails.endTime)}
        </p>
        <p>
          <strong>Amount Paid:</strong> ₹{bookingDetails.amount}
        </p>
      </div>
      <p className="redirect-message">Redirecting to your bookings...</p>
      <button
        onClick={() => navigate("/bookings")}
        className="view-bookings-button"
      >
        View My Bookings
      </button>

      <style jsx>{`
        .payment-success-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          text-align: center;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .success-icon {
          font-size: 48px;
          color: #4caf50;
          margin-bottom: 1rem;
        }

        .booking-details {
          margin: 2rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
          text-align: left;
        }

        .booking-details p {
          margin: 0.5rem 0;
        }

        .redirect-message {
          color: #666;
          margin: 1rem 0;
        }

        .view-bookings-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .view-bookings-button:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
