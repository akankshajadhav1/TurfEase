import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Homecard from "./Homecard";
import FooterComponent from "./FooterComponent";

function UserHome() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="Userhome-container container-fluid d-flex flex-column align-items-center justify-content-center"
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "80vh",
          paddingBottom: "50px",
        }}
      >
        <div className="text-center px-3">
          <h1 className="text-primary fw-bold mt-5">Welcome to TurfEase</h1>

          <p className="text-dark fw-medium fs-5 mt-3">
            Book premium sports turfs effortlessly with real-time availability!
          </p>

          <h2 className="text-success mt-2">
            "Explore & Book Your Favorite Turf Now!"
          </h2>

          {/* Booking Button */}
          <div className="d-flex justify-content-center mt-4">
            <Link
              className="btn"
              to="/getAllTurf"
              style={{
                backgroundColor: "skyblue",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
            >
              Go to Turf
            </Link>
          </div>
        </div>

        {/* Turf Cards Section */}
        <div
          style={{
            alignItems: "center",
            marginLeft: "60px",
            textAlign: "center",
          }}
          className="item-center mt-5 ml-3"
        >
          <Homecard className="item-center" /> {/* Turf Cards Here */}
        </div>
      </div>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}

export default UserHome;
