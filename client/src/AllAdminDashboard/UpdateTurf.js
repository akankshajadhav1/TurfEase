import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateTurf = () => {
  const { id } = useParams(); // Get turf ID from the URL
  const navigate = useNavigate(); // For navigation

  const [turfData, setTurfData] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/turfs/${id}`
        );
        setTurfData(response.data);
      } catch (err) {
        setError("Failed to fetch turf details.");
        console.error("Error fetching turf:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTurf();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurfData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/turfs/${id}`, turfData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Turf updated successfully!");
      navigate("/viewTurf");
    } catch (error) {
      console.error("Error updating turf:", error);
      alert("Failed to update turf.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p>Loading turf details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #d4fc79, #96e6a1)",
        minHeight: "100vh",
      }}
    >
      <div className="container py-4">
        <h2 className="text-center mb-4 text-success fw-bold">Update Turf</h2>

        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
          <div className="mb-3">
            <label className="form-label">Turf Name</label>
            <input
              type="text"
              name="name"
              value={turfData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter turf name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={turfData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter location"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price per Hour (₹)</label>
            <input
              type="number"
              name="pricePerHour"
              value={turfData.pricePerHour}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter price per hour"
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={turfData.imageUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success me-3">
              Update Turf
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/viewTurf")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTurf;
