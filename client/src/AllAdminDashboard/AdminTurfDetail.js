import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTurfById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/TurfDetail.css";

const AdminTurfDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !user) {
      const currentPath = location.pathname;
      navigate("/login", {
        state: { from: currentPath },
        replace: true,
      });
    }
  }, [isAuthenticated, authLoading, user, navigate, location]);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await getTurfById(id);
        setTurf(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching turf details");
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  if (!turf) {
    return <div className="text-center mt-5">No Turf Found</div>;
  }

  return (
    <div className="container my-5">
      <div
        className="row border rounded-4 shadow p-4 g-4"
        style={{
          background:
            "linear-gradient(to bottom, rgb(180, 227, 135), rgb(79, 179, 196))",
        }}
      >
        {/* Image Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          {turf.imageUrl ? (
            <img
              src={turf.imageUrl}
              alt={turf.name}
              className="img-fluid rounded-4"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                width: "100%",
              }}
            />
          ) : (
            <div className="text-muted">No Image Available</div>
          )}
        </div>

        {/* Details Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="mb-3">{turf.name}</h2>
          <p>
            <strong>Location:</strong> {turf.location}
          </p>
          <p>
            <strong>Type:</strong> {turf.type}
          </p>
          <p>
            <strong>Price per Hour:</strong> ₹{turf.pricePerHour}
          </p>
          <p>
            <strong>Facilities:</strong> {turf.facilities || "N/A"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {turf.description || "No description available."}
          </p>

          {/* Booking Button */}
        </div>
      </div>
    </div>
  );
};

export default AdminTurfDetail;
