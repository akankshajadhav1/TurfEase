import React from "react";
import { Link } from "react-router-dom";
import "../style/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="mt-0">
      <div className="dashboard">
        <section className="showcase">
          <video
            src="https://videos.pexels.com/video-files/3192082/3192082-uhd_3840_2160_25fps.mp4"
            muted
            loop
            autoPlay
          ></video>

          <div className="overlay"></div>

          <div className="text">
            <h2 className="mt-2 " style={{ color: "white" }}>
              Reserve Your Perfect Playing Field
            </h2>
            <p className="mt-4">
              Experience the thrill of your favorite sport on our
              well-maintained turfs. Choose from a variety of sizes and surfaces
              to suit your needs. Book your turf online quickly and easily!
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          </div>

          {/* Social Media Icons */}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
