import React from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import {
  BsJournalCheck,
  BsBell,
  BsHandThumbsUp,
  BsCreditCard2Back,
  BsCardText,
  BsPinMap,
} from "react-icons/bs";
import img1 from "../images/A.jpg";
import "../style/AboutUs.css";

const AboutUs = () => {
  const features = [
    {
      icon: <BsJournalCheck />,
      title: "Advance Reservation & Online Booking",
      text: "Book your turfs in advance by using our website.",
    },
    {
      icon: <BsBell />,
      title: "Real-time Alerts & Notifications",
      text: "You will get your booking and cancellation status via SMS and email.",
    },
    {
      icon: <BsHandThumbsUp />,
      title: "Rate & Review",
      text: "You can rate the turfs/playgrounds you are playing at.",
    },
    {
      icon: <BsCreditCard2Back />,
      title: "Multiple Payment Modes",
      text: "You can pay via both online and offline modes.",
    },
    {
      icon: <BsCardText />,
      title: "Discount Vouchers",
      text: "Generate discount vouchers for special customers.",
    },
    {
      icon: <BsPinMap />,
      title: "Location Search",
      text: "Search and find turfs around you.",
    },
  ];

  const teamMembers = [
    { name: "AAA", role: "Front-End Developer", img: img1 },
    { name: "BBB", role: "Full-Stack Developer", img: img1 },
    { name: "CCC", role: "Full-Stack Developer", img: img1 },
  ];

  return (
    <div>
      <div className="about-page">
        <section className="pt-4">
          <div className="about-container">
            <h2 className="text-center mb-4 ">Our Features</h2>

            <div className="feature-container">
              {features.map((feature, index) => (
                <div className="feature-card" key={index}>
                  <div className="card-body text-center">
                    <div className="feature-icon">{feature.icon}</div>
                    <h4 className="fw-bold">{feature.title}</h4>
                    <p>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="divider" />
            <h2 className="text-center">Meet Our Team</h2>
            <div className="team-container">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="team-img"
                  />
                  <h5>{member.name}</h5>
                  <strong>{member.role}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="about-footer ">
          <div className="about-container text-center">
            <p
              style={{
                color: "#06933C",
                fontSize: "20px",
                backgroundColor: "#1a1a1a",
              }}
            >
              Copyright &copy; BookaCourt 2025
            </p>
            <div className="about-social-icons">
              <a
                href="https://www.facebook.com"
                style={{ color: "white", fontSize: "24px" }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                style={{ color: "white", fontSize: "24px" }}
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.twitter.com"
                style={{ color: "white", fontSize: "24px" }}
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
