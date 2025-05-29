import React from "react";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

// Make sure to call loadStripe outside of a component's render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper = ({ bookingId }) => {
  const fetchClientSecret = () => {
    return fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then((response) => response.json())
      .then((data) => data.clientSecret);
  };

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0570de",
          },
        },
      }}
    >
      <PaymentForm />
    </CheckoutProvider>
  );
};

export default PaymentWrapper;
