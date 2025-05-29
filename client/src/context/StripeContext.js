import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
};

// Initialize Stripe outside of component to prevent multiple instances
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_your_publishable_key"
);

export const StripeProvider = ({ children }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, succeeded, failed
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    // Verify Stripe loaded correctly
    stripePromise.catch((err) => {
      console.error("Failed to load Stripe:", err);
      setStripeError(err.message);
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      clientSecret,
      setClientSecret,
      paymentStatus,
      setPaymentStatus,
      stripeError,
    }),
    [clientSecret, paymentStatus, stripeError]
  );

  if (stripeError) {
    return (
      <div className="stripe-error">
        Failed to load payment system: {stripeError}
      </div>
    );
  }

  return (
    <StripeContext.Provider value={value}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: clientSecret || undefined,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0570de",
              colorBackground: "#ffffff",
              colorText: "#30313d",
              colorDanger: "#df1b41",
              fontFamily: "Ideal Sans, system-ui, sans-serif",
              borderRadius: "4px",
            },
          },
        }}
      >
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};
