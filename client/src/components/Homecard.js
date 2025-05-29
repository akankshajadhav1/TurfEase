import React from "react";
import Card from "react-bootstrap/Card";
import cricket_turf from "../images/cricket_turf.jpg"; // Adjust path as needed
import football_turf from "../images/football_turf.jpg";
import badminton_truf from "../images/badminton_truf.jpg";
import volleyball_turf from "../images/volleyball_turf.jpg";
import "../style/Homecard.css";
function Homecard() {
  return (
    <div
      className="d-flex  w-30 h-9 "
      style={
        {
          // marginRight: "20px",
          // borderRadius: "5px",
          // boxShadow: "4px 4px 5px rgba(39, 148, 215, 0.3)", // Shadow effect
        }
      }
    >
      <Card
        border="info"
        style={{
          width: "18rem",
          padding: "10px",
          margin: "10px",
        }}
      >
        <Card.Img
          variant="top"
          src={cricket_turf}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            Cricket Turf
          </Card.Title>
          <Card.Text
            style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}
          >
            Book the best cricket turfs with real-time availability 🏏.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        border="info"
        style={{ width: "18rem", padding: "10px", margin: "10px" }}
      >
        <Card.Img
          variant="top"
          src={football_turf}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            FootBall
          </Card.Title>
          <Card.Text
            style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}
          >
            Book the best football turfs withand top-quality facilities ⚽.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        border="info"
        style={{ width: "18rem", padding: "10px", margin: "10px" }}
      >
        <Card.Img
          variant="top"
          src={badminton_truf}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            BadMinton
          </Card.Title>
          <Card.Text
            style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}
          >
            Book the best badminton courts with professional-grade amenities 🏸.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        border="info"
        style={{
          width: "18rem",
          padding: "10px",
          margin: "10px",
        }}
      >
        <Card.Img
          variant="top"
          src={volleyball_turf}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            Volleyball
          </Card.Title>
          <Card.Text
            style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}
          >
            Book the bestVolleyball turfs with real-time availability 🏐.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Homecard;
