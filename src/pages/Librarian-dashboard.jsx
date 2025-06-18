import React, { useEffect, useState, useCallback } from "react";
import BASE_URL from "../api"; // Ensure this path is correct

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", userType: "" });
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/dashboard/admin/issue_requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

 useEffect(() => {
  const userType = localStorage.getItem("userType");

  if (!token || !userType || userType.toLowerCase() !== "admin") {
    setError("Unauthorized. Only librarians can access this page.");
    return;
  }

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser({ name: data.fullName || "Admin", userType }); // fixed here
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile info.");
    }
  };

  fetchProfile();
  fetchRequests();
}, [fetchRequests, token]);


 const handleAction = async (book_transaction_id, action) => {
  try {
    if (!book_transaction_id) {
      throw new Error("Invalid book transaction ID");
    }

    const endpoint = `${BASE_URL}/dashboard/admin/issue_request/${action}/${book_transaction_id}`;
    const res = await fetch(endpoint, {
      method: "PATCH", // already fixed
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${action} request failed`);
    }

    alert(`Request ${action}d successfully!`);

    // Remove the item from UI
    setRequests(prev =>
      prev.filter(
        req => req.book_transaction.book_transaction_id !== book_transaction_id
      )
    );

    // You can remove this line now if you're doing it from state:
    // fetchRequests();
  } catch (err) {
    alert(err.message);
  }
};


  if (error) {
    return <div className="p-6 text-red-600 text-xl font-medium">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
      <div className="mb-4">
        <strong>User Type:</strong> {user.userType}
      </div>

      {/* Admin Controls */}
      <div className="p-4 border rounded bg-gray-100 mb-6">
        <h2 className="text-xl font-medium mb-2">Admin Controls</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <a href="/librarian-dashboard/admin/add_books" className="text-blue-600 underline">
              Add New Book
            </a>
          </li>
          <li>
            <a href="/librarian-dashboard/admin/update_books" className="text-blue-600 underline">
              Update Book
            </a>
          </li>
          <li>
            <a href="/librarian-dashboard/admin/manage_users" className="text-blue-600 underline">
              Manage Users
            </a>
          </li>
        </ul>
      </div>

      {/* Pending Book Requests */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Pending Book Requests</h2>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-600">No pending requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req, index) => (
              <li
                key={index}
                className="bg-white border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <p><strong>Book:</strong> {req.book_info.name}</p>
                  <p><strong>Requested By:</strong> {req.book_transaction.username}</p>
                  <p><strong>Status:</strong> {req.book_transaction.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    onClick={() => handleAction(req.book_transaction.book_transaction_id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleAction(req.book_transaction.book_transaction_id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="mt-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
