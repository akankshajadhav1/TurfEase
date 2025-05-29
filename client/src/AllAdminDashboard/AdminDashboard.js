// import React from "react";
// import { Link } from "react-router-dom";

// import { AiOutlineAppstoreAdd } from "react-icons/ai";
// import { GoPackage } from "react-icons/go";
// // import AdminNavComponents from "./AdminNavComponents";
// import { CiBookmarkCheck } from "react-icons/ci";
// import "../style/AdminDashboard.css";
// import AdminDashboardImg from "../images/admindashboard.png";
// import AdminDashboardImg1 from "../images/admindashboard1.png";
// import AdminDashboardImg2 from "../images/admindashboard2.png";
// const AdminDashboard = () => {
//   return (
//     <div className="admin">
//       <h1 className="text-center display-5 admindashboard">Admin Dashboard</h1>

//       <div className="row row-2 vh-100" style={{ borderTop: "1px solid gray" }}>
//         <div
//           className="col-3"
//           style={{ backgroundColor: "skyblue", paddingTop: "50px" }}
//         >
//           {/* 🚀 Add image here */}

//           <Link to="/viewTurf" className="router-link">
//             <div className="admin-dashboard-link">
//               <GoPackage className="admin-dashboard-icon" />
//               <span>View Turf</span>
//             </div>
//           </Link>

//           <Link to="/addTurfs" className="router-link">
//             <div className="admin-dashboard-link">
//               <AiOutlineAppstoreAdd className="admin-dashboard-icon" />
//               <span>Add Turf</span>
//             </div>
//           </Link>
//           <Link to="/viewbookingTurf" className="router-link">
//             <div className="admin-dashboard-link">
//               <CiBookmarkCheck className="admin-dashboard-icon" />
//               <span>Booking List</span>
//             </div>
//           </Link>
//         </div>
//         <div
//           style={{ marginBottom: "300px" }}
//           className="col-9 d-flex flex-row justify-content-center align-items-center gap-4 p-0"
//         >
//           {/* First Card */}
//           <div
//             className="card text-center shadow"
//             style={{
//               width: "300px",
//               padding: "20px",
//               borderRadius: "20px",
//               backgroundColor: "#f0f8ff",
//             }}
//           >
//             <img
//               src={AdminDashboardImg}
//               alt="Admin Dashboard 1"
//               style={{
//                 width: "100%",
//                 height: "200px",
//                 borderRadius: "15px",
//                 objectFit: "cover",
//                 marginBottom: "15px",
//               }}
//             />
//             <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
//               "Sports do not build character. They reveal it."
//             </h5>
//           </div>

//           {/* Second Card */}
//           <div
//             className="card text-center shadow"
//             style={{
//               width: "300px",
//               padding: "20px",
//               borderRadius: "20px",
//               backgroundColor: "#f0f8ff",
//             }}
//           >
//             <img
//               src={AdminDashboardImg1} // 👉 Add second image in your project
//               alt="Admin Dashboard 2"
//               style={{
//                 width: "100%",
//                 height: "200px",
//                 borderRadius: "15px",
//                 objectFit: "cover",
//                 marginBottom: "15px",
//               }}
//             />
//             <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
//               "Champions keep playing until they get it right."
//             </h5>
//           </div>
//           {/* Third Card */}
//           <div
//             className="card text-center shadow"
//             style={{
//               width: "300px",
//               padding: "20px",
//               borderRadius: "20px",
//               backgroundColor: "#f0f8ff",
//             }}
//           >
//             <img
//               src={AdminDashboardImg2} // 👉 Add second image in your project
//               alt="Admin Dashboard 3"
//               style={{
//                 width: "100%",
//                 height: "200px",
//                 borderRadius: "15px",
//                 objectFit: "cover",
//                 marginBottom: "15px",
//               }}
//             />
//             <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
//               "Organize the turf, energize the players."
//             </h5>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { CiBookmarkCheck } from "react-icons/ci";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "../style/AdminDashboard.css";
import AdminDashboardImg from "../images/admindashboard.png";
import AdminDashboardImg1 from "../images/admindashboard1.png";
import AdminDashboardImg2 from "../images/admindashboard2.png";
const AdminDashboard = () => {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookings/admin",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        console.log("Raw booking data:", data);

        // Filter data to only include the current month
        const filteredData = data.filter((booking) => {
          const bookingDate = new Date(booking.date);
          const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
          const currentYear = new Date().getFullYear(); // Get current year
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          );
        });

        // Group bookings by day (date)
        const groupedData = {};
        filteredData.forEach((booking) => {
          const date = new Date(booking.date).getDate(); // Get the day of the month
          if (groupedData[date]) {
            groupedData[date] += 1;
          } else {
            groupedData[date] = 1;
          }
        });

        // Prepare data for the chart
        const chartData = [];
        for (let i = 1; i <= 31; i++) {
          chartData.push({
            date: i,
            count: groupedData[i] || 0, // Default to 0 if no bookings on that day
          });
        }

        setBookingData(chartData); // Set the final data for the chart
      } catch (error) {
        console.error("Error fetching booking data", error);
      }
    };

    fetchBookingData();
  }, []);

  return (
    <div className="admin">
      <h1 className="text-center display-5 admindashboard">Admin Dashboard</h1>

      <div className="row row-2 vh-100" style={{ borderTop: "1px solid gray" }}>
        {/* Sidebar */}
        <div
          className="col-3"
          style={{ backgroundColor: "skyblue", paddingTop: "50px" }}
        >
          <Link to="/viewTurf" className="router-link">
            <div className="admin-dashboard-link">
              <GoPackage className="admin-dashboard-icon" />
              <span>View Turf</span>
            </div>
          </Link>
          <Link to="/addTurfs" className="router-link">
            <div className="admin-dashboard-link">
              <AiOutlineAppstoreAdd className="admin-dashboard-icon" />
              <span>Add Turf</span>
            </div>
          </Link>
          <Link to="/viewbookingTurf" className="router-link">
            <div className="admin-dashboard-link">
              <CiBookmarkCheck className="admin-dashboard-icon" />
              <span>Booking List</span>
            </div>
          </Link>
        </div>

        {/* Main Section */}
        <div className=" row row2 col-9 d-flex flex-row justify-content-center align-items-center gap-4 p-0">
          <div className="col-9 d-flex flex-column align-items-center p-4">
            {/* Graph */}
            <div
              style={{
                width: "100%",
                height: 400,
                padding: "20px",
                border: "2px solid #333",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {bookingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#aaa" />
                    <XAxis
                      dataKey="date"
                      stroke="#000"
                      label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      stroke="#000"
                      label={{
                        value: "Bookings",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#3498db"
                      barSize={50}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>

          {/* First Card */}
          <div
            className="card text-center shadow"
            style={{
              width: "300px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: "#f0f8ff",
            }}
          >
            <img
              src={AdminDashboardImg}
              alt="Admin Dashboard 1"
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "15px",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
            <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              "Sports do not build character. They reveal it."
            </h5>
          </div>

          {/* Second Card */}
          <div
            className="card text-center shadow"
            style={{
              width: "300px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: "#f0f8ff",
            }}
          >
            <img
              src={AdminDashboardImg1} // 👉 Add second image in your project
              alt="Admin Dashboard 2"
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "15px",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
            <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              "Champions keep playing until they get it right."
            </h5>
          </div>
          {/* Third Card */}
          <div
            className="card text-center shadow"
            style={{
              width: "300px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: "#f0f8ff",
            }}
          >
            <img
              src={AdminDashboardImg2} // 👉 Add second image in your project
              alt="Admin Dashboard 3"
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "15px",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
            <h5 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              "Organize the turf, energize the players."
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
