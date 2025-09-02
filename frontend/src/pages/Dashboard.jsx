import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "./Dashboard.css";
import axios from "axios";
import Login from "./Login";


function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // User input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User list
  const [users, setUsers] = useState([]);

  // Loading state for adding user
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const [editUser, setEditUser] = useState(null);   // stores the user being edited
  const [showEditModal, setShowEditModal] = useState(false);  // controls modal visibility

  //edit form state
  const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  role: "",
  password: "",   // new
  });

  const handleEditClick = (user) => {
  setEditUser(user);
  setEditForm({
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",  // leave empty on purpose
  });
  setShowEditModal(true);
  };

  // Inside Dashboard component
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");

      // Make PUT request to backend
      const response = await axios.put(
        `http://localhost:3000/api/users/${editUser._id}`,
        {
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          password: editForm.password || undefined, // only send if new password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update frontend state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editUser._id ? response.data.user : user
        )
      );

      // Close modal
      setShowEditModal(false);
      setEditForm({ name: "", email: "", role: "user", password: "" });

      alert("User updated successfully ✅");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
     try {
      const token = localStorage.getItem("token"); // get token
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });

    // update frontend state (remove deleted user from list)
    setUsers(users.filter((user) => user._id !== id));

    alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
} 

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
    setIsLoading(false);
  }, []);

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsAddingUser(true); // start loading
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setUsers((prevUsers) => [...prevUsers, response.data.user]);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setShowModal(false);
    } catch (error) {
      console.log("Error registering user", error.response ? error.response.data : error.message);
    } finally {
      setIsAddingUser(false); // stop loading
    }
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const res = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err.response ? err.response.data : err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : !isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <div className="dashboard">
          {/* Navbar */}
          <div className="navbar">
            <div className="header">
              <h2>Admin Dashboard</h2>
              <p>User Management System</p>
            </div>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              <i className="fa-solid fa-user-plus"></i> Add User
            </button>
          </div>

          {/* Table Section */}
          <div className="table-container">
            <h3>Registered Users</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Date Registered</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.createdAt 
                        ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                        : "N/A"}
                    </td>

                    <td>
                      {user.lastActivity
                        ? new Date(user.lastActivity).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="actionBtns">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditClick(user)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>Register New User</h2>
                <form className="user-form" onSubmit={handleRegister}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group password-group">
                    <label>Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="fa-solid fa-eye-slash"></i>
                        ) : (
                          <i className="fa-solid fa-eye"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isAddingUser}>
                      {isAddingUser ? "Adding user..." : "Register"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* {editModal} */}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>Edit User</h2>
                <p>
                  Selected: <strong>{editUser?.name}</strong> ({editUser?.email})
                </p>

                {/* FORM STARTS HERE */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateUser(); // we’ll define this next
                  }}
                >
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({ ...editForm, password: e.target.value })
                      }
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Dashboard;
