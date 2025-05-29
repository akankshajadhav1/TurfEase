import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { createPaymentIntent, confirmPayment } from "../services/api";

// Make sure to call loadStripe outside of a component's render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        throw error;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Update booking status in our backend
        await confirmPayment(bookingDetails.id, paymentIntent.id);

        // Redirect to success page
        navigate("/payment-success", {
          state: {
            bookingId: bookingDetails.id,
            amount: bookingDetails.totalCost,
            turfName: bookingDetails.turf.name,
            date: bookingDetails.date,
            startTime: bookingDetails.startTime,
            endTime: bookingDetails.endTime,
          },
          replace: true, // This will replace the current entry in the history stack
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Invalid Time";

      // Handle HH:mm:ss format
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
      console.error("Time formatting error:", error);
      return "Invalid Time";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <h3>Booking Details</h3>
        {bookingDetails && (
          <div className="booking-details">
            <p>
              <strong>Turf:</strong> {bookingDetails.turf.name}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(bookingDetails.date)}
            </p>
            <p>
              <strong>Time:</strong> {formatTime(bookingDetails.startTime)} -{" "}
              {formatTime(bookingDetails.endTime)}
            </p>
            <p className="amount">
              <strong>Amount:</strong> ₹{bookingDetails.totalCost}
            </p>
          </div>
        )}
        <p className="currency-note">
          All payments are processed in Indian Rupees (INR)
        </p>
      </div>

      <div className="payment-element-container">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="payment-button"
      >
        {isLoading
          ? "Processing..."
          : `Pay ₹${bookingDetails?.totalCost || "0"}`}
      </button>

      {errorMessage && (
        <div
          className="error-message"
          style={{ color: "red", marginTop: "10px" }}
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
};

const PaymentForm = ({ bookingId }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await createPaymentIntent(bookingId);
        console.log("Payment intent response:", response);

        if (!response.data || !response.data.clientSecret) {
          throw new Error("Invalid response from server");
        }

        setClientSecret(response.data.clientSecret);
        setBookingDetails(response.data.booking);
      } catch (err) {
        console.error("Error initializing payment:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to initialize payment";
        setError(errorMessage);

        // Redirect back to bookings page if there's an error
        setTimeout(() => {
          navigate("/bookings");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      initializePayment();
    } else {
      setError("No booking ID provided");
      setIsLoading(false);
      // Redirect back to bookings page if no booking ID
      setTimeout(() => {
        navigate("/bookings");
      }, 3000);
    }
  }, [bookingId, navigate]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Arial, sans-serif",
      borderRadius: "4px",
    },
    rules: {
      ".Tab": {
        border: "1px solid #e6e6e6",
        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.03)",
      },
      ".Tab:hover": {
        color: "#0570de",
      },
      ".Tab--selected": {
        borderColor: "#0570de",
      },
      ".Input": {
        padding: "12px",
      },
      ".Label": {
        fontWeight: "500",
      },
    },
  };

  if (isLoading) {
    return <div className="loading">Initializing payment system...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
        <p>Redirecting to bookings page...</p>
      </div>
    );
  }

  if (!clientSecret || !bookingDetails) {
    return (
      <div className="error-message">Unable to initialize payment system</div>
    );
  }

  return (
    <div className="payment-container">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance,
          locale: "en",
        }}
      >
        <CheckoutForm bookingDetails={bookingDetails} />
      </Elements>
    </div>
  );
};

export default PaymentForm;
