import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTurfById, checkAvailability, createBooking } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PaymentForm from "./PaymentForm";
import "../style/BookingForm.css";
const BookingForm = () => {
  const { turfId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !user) {
      // Save current location before redirecting
      const currentPath = location.pathname;
      navigate("/login", {
        state: { from: currentPath },
        replace: true,
      });
    }
  }, [isAuthenticated, authLoading, user, navigate, location]);

  // Fetch turf details
  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await getTurfById(turfId);
        setTurf(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching turf");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchTurf();
    }
  }, [turfId, isAuthenticated, user]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setSelectedSlot(null);
    setError(null);

    if (selectedDate) {
      try {
        const response = await checkAvailability(turfId, selectedDate);
        setAvailableSlots(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error checking availability");
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      const currentPath = location.pathname;
      navigate("/login", {
        state: { from: currentPath },
        replace: true,
      });
      return;
    }

    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData = {
        turfId: Number(turfId),
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        eventName: "Turf Booking",
        userId: user.id, // Add user ID to booking data
      };

      const response = await createBooking(bookingData);
      setBooking(response.data);
      setShowPayment(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth or loading turf
  if (authLoading || (loading && !turf)) {
    return <div className="loading">Loading...</div>;
  }

  // Show nothing while redirecting to login
  if (!isAuthenticated || !user) {
    return null;
  }

  // Show error if turf fetch failed
  if (error && !turf) {
    return <div className="error">{error}</div>;
  }

  // Show payment form if booking is created
  if (showPayment && booking) {
    return (
      <div style={{}} className="payment-container mt-10">
        <h2>Complete Payment</h2>
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>
            <strong>Turf:</strong> {turf.name}
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
            <strong>Total Cost:</strong> ₹{booking.totalCost}
          </p>
        </div>
        <PaymentForm bookingId={booking.id} />
      </div>
    );
  }

  // Show booking form
  return (
    <div
      className="mt-10"
      style={{
        backgroundColor: "linear-gradient(to bottom, #8dc4eb, #ffffff)",
      }}
    >
      <div className="booking-form-container mt-10">
        <h2>Book {turf?.name}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {date && availableSlots.length > 0 && (
            <div className="form-group">
              <label>Available Time Slots</label>
              <div className="time-slots">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`time-slot ${
                      selectedSlot === slot ? "selected" : ""
                    }`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                    {new Date(slot.endTime).toLocaleTimeString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!date || !selectedSlot || loading}
            className="submit-button"
          >
            {loading ? "Processing..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
