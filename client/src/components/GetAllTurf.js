import React, { useEffect, useState } from "react";

import "../style/TurfList.css";

import TurfCard from "./TurfCard";
import { getTurfs } from "../services/api";
const GetAllTurf = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await getTurfs();
        setTurfs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching turfs");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      className="mt-0"
      style={{
        width: "1000",
        height: "1000",
        backgroundColor:
          "linear-gradient(to right,rgb(160, 189, 208),rgb(212, 231, 159))",
      }}
    >
      <h2
        className="text-center mb-4   "
        style={{ color: "#007bff", fontWeight: "bold", marginTop: "9px" }}
      >
        Available Turfs
      </h2>
      <div className="Get-container mt-7 ">
        <div className="col ">
          <TurfCard />
        </div>
      </div>
    </div>
  );
};

export default GetAllTurf;
