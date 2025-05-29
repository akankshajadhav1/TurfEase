import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTurfs } from "../services/api"; // ✅ IMPORT getTurfs
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/ViewTurf.css";
import axios from "axios";
const ViewTurf = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // optional: handle errors

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await getTurfs(); // ✅ USE getTurfs()
        const uniqueTurfs = Array.from(
          new Map(response.data.map((turf) => [turf.id, turf])).values()
        );
        setTurfs(uniqueTurfs);
      } catch (err) {
        console.error("Error fetching turfs:", err);
        setError(err.response?.data?.message || "Failed to fetch turfs");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);
  const handleDelete = async (turfId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this turf?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token"); // or wherever you stored the token
        await axios.delete(`http://localhost:5000/api/turfs/${turfId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTurfs((prevTurfs) => prevTurfs.filter((turf) => turf.id !== turfId));
        alert("Turf deleted successfully!");
      } catch (error) {
        console.error("Error deleting turf:", error);
        alert(error.response?.data?.message || "Failed to delete turf.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p>Loading turfs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #a8edea, #fed6e3)",
        minHeight: "100vh",
      }}
    >
      {/* <AdminNavComponents /> */}
      <div className="container py-4">
        <h2
          className="text-center mb-4"
          style={{ color: "green", fontWeight: "bold" }}
        >
          Turf List
        </h2>

        {turfs.length === 0 ? (
          <div className="alert alert-warning text-center">
            No turfs available.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Turf Name</th>
                  <th>Location</th>
                  <th>Price (₹/hr)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {turfs.map((turf, index) => (
                  <tr key={turf.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={turf.imageUrl}
                        alt={turf.name}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="rounded"
                      />
                    </td>
                    <td>{turf.name}</td>
                    <td>{turf.location}</td>
                    <td>₹{turf.pricePerHour}</td>
                    <td>
                      <Link
                        to={`/turfs/${turf.id}`}
                        state={{ isAdmin: true }}
                        className="btn btn-primary btn-sm me-2 mb-1"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/updateTurf/${turf.id}`}
                        className="btn btn-success btn-sm me-2 mb-1"
                      >
                        Update
                      </Link>

                      <button
                        className="btn btn-danger me-2"
                        style={{
                          color: "white",
                          border: "2px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(turf.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTurf;
