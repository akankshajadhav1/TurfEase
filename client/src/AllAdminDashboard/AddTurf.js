import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddTurf = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    type: "",
    pricePerHour: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login again.");
      return;
    }

    if (parseFloat(formData.pricePerHour) <= 0) {
      setError("Price per hour must be greater than zero.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/turfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          pricePerHour: parseFloat(formData.pricePerHour),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Turf added successfully!");
        setFormData({
          name: "",
          location: "",
          description: "",
          type: "",
          pricePerHour: "",
          imageUrl: "",
        });
      } else {
        setError(data?.message || "Failed to add turf.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error while adding turf.");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right,rgb(167, 241, 167), #a1c4fd)",
      }}
    >
      <div className="container mt-1">
        <h2 className="text-center mb-4  " style={{ color: "black" }}>
          Add New Turf
        </h2>
        <form className="card p-4 shadow-lg rounded" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Turf Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              className="form-select"
              id="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="TURF">Turf</option>
              <option value="STADIUM">Stadium</option>
              <option value="PLAYGROUND">Playground</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pricePerHour" className="form-label">
              Price per Hour
            </label>
            <input
              type="number"
              className="form-control"
              id="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">
              Image URL
            </label>
            <input
              type="url"
              className="form-control"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Turf
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTurf;

// INSERT INTO turf (name, location, description, type, pricePerHour, imageUrl, createdAt, updatedAt)  VALUES('Cricket Pro Turf', 'Pune', 'Well-maintained cricket turf with night lights', 'TURF', 75.00, 'https://www.cricketgraph.com/wp-content/uploads/2021/06/Indooor-Nets.jpg', NOW(3), NOW(3));
