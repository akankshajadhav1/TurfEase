import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const login = (email, password) => {
  return api.post("/users/login", { email, password });
};

export const register = (name, email, password, phone) => {
  return api.post("/users/register", { name, email, password, phone });
};

export const getCurrentUser = () => {
  return api.get("/users/profile");
};

// Turf API
export const getTurfs = () => {
  return api.get("/turfs");
};

export const getTurfById = (id) => {
  return api.get(`/turfs/${id}`);
};

export const addTurf = async (turf) => {
  return await api.post("/turfs", turf);
};

// Booking API
export const checkAvailability = (turfId, date) => {
  return api.get(`/bookings/availability/${turfId}`, { params: { date } });
};

export const createBooking = (bookingData) => {
  return api.post("/bookings", bookingData);
};

export const getUserBookings = () => {
  return api.get("/bookings");
};

export const cancelBooking = (bookingId) => {
  return api.delete(`/bookings/${bookingId}`);
};

// Payment API
export const createPaymentIntent = (bookingId) => {
  return api.post("/payments/create-intent", { bookingId });
};

export const confirmPayment = (bookingId, paymentIntentId) => {
  return api.post("/payments/confirm", { bookingId, paymentIntentId });
};

export default api;
