import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTurfs } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/TurfCard.css";

const TurfCard = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await getTurfs();
        const uniqueTurfs = Array.from(
          new Map(response.data.map((turf) => [turf.id, turf])).values()
        );
        setTurfs(uniqueTurfs);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching turfs");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container my-5">
      <div className="row g-4">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
          >
            <div className="card turf-card shadow-sm w-100">
              {turf.imageUrl && (
                <img
                  src={turf.imageUrl}
                  className="card-img-top"
                  alt={turf.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{turf.name}</h5>
                <p className="card-text mb-1">
                  <strong>Location:</strong> {turf.location}
                </p>
                <p className="card-text mb-1">
                  <strong>Type:</strong> {turf.type}
                </p>
                <p className="card-text mb-3">
                  <strong>Price:</strong> ₹{turf.pricePerHour} per hour
                </p>
                <Link
                  to={`/turfs/${turf.id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurfCard;
