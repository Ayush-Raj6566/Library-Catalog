import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", userType: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("fullName");
    const userType = localStorage.getItem("userType");

    if (!token || !userType || userType.toLowerCase() !== "admin") {
      setError("Unauthorized. Only librarians can access this page.");
      return;
    }

    setUser({ name, userType });
  }, []);

  if (error) {
    return <div className="p-6 text-red-600 text-xl font-medium">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
      <div className="mb-4">
        <strong>User Type:</strong> {user.userType}
      </div>
      
      {/* Admin Controls */}
      {user.userType.toLowerCase() === "admin" && (
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-medium mb-2">Admin Controls</h2>
          <ul className="list-disc pl-6">
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
      )}

      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
