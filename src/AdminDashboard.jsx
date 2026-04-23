import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      setPassword("");
      loadContacts();
    } else {
      setPasswordError("Incorrect password");
      setPassword("");
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      setMessage("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData(contact);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      const response = await fetch("/api/contact/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      setMessage("Contact updated successfully");
      setEditingId(null);
      setEditData({});
      loadContacts();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error updating contact");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/contact/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      setMessage("Contact deleted successfully");
      loadContacts();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error deleting contact");
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const downloadCSV = () => {
    if (contacts.length === 0) {
      setMessage("No contacts to download");
      return;
    }

    const headers = ["ID", "Name", "Email", "Message", "Timestamp"];
    const rows = contacts.map((c) => [
      c.id || "N/A",
      `"${c.name || ""}"`,
      c.email,
      `"${c.message.replace(/"/g, '""')}"`,
      c.timestamp,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setContacts([]);
    setMessage("");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1>Admin Dashboard</h1>
          <p>Enter password to access</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Contact Submissions</h1>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <div className="admin-toolbar">
        <button onClick={downloadJSON} className="btn-secondary">
          Download JSON
        </button>
        <button onClick={downloadCSV} className="btn-secondary">
          Download CSV
        </button>
        <span className="contact-count">Total: {contacts.length}</span>
      </div>

      {loading ? (
        <div className="admin-loading">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="admin-empty">No contacts yet</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) =>
                editingId === contact.id ? (
                  <tr key={contact.id} className="edit-row">
                    <td>{contact.id}</td>
                    <td>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={editData.message}
                        onChange={(e) =>
                          setEditData({ ...editData, message: e.target.value })
                        }
                      />
                    </td>
                    <td>{contact.timestamp}</td>
                    <td className="action-buttons">
                      <button onClick={saveEdit} className="btn-save">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn-cancel">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={contact.id}>
                    <td>{contact.id}</td>
                    <td>{contact.name || "N/A"}</td>
                    <td>{contact.email}</td>
                    <td className="message-cell">
                      {contact.message.substring(0, 50)}...
                    </td>
                    <td className="timestamp">
                      {new Date(contact.timestamp).toLocaleString()}
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => startEdit(contact)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
