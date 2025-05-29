import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavComponents from "./AdminNavComponents";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/ViewTurf.css";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        // 👉 Make a request to a new API that gives all "user" role users
        const response = await axios.get(
          "http://localhost:3000/api/users?role=user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data); // because it will be an array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log("User deleted:", id);
      } catch (error) {
        console.log("Can't delete user:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p>Loading User List...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #a8edea, #fed6e3)",
        minHeight: "100vh",
      }}
    >
      <AdminNavComponents />
      <div className="container py-4">
        <h2
          className="text-center mb-4"
          style={{ color: "green", fontWeight: "bold" }}
        >
          User List
        </h2>

        {users.length === 0 ? (
          <div className="alert alert-warning text-center">
            No users available.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email Id</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-sm mb-1 me-2"
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

export default ViewUser;
