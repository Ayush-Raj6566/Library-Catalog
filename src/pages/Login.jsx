import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import { auth, provider, signInWithPopup } from "./fireBase_backup";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); 
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          user_type: userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("username", username);
         localStorage.setItem("fullName", data.fullName);
console.log(data); // check if fullName exists

      if (userType.toLowerCase() === "admin") {
  navigate("/librarian-dashboard"); // librarian panel
} else {
  navigate("/user-dashboard"); // user panel
}

      } else {
        alert(data.detail || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="relative mb-4">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full p-2 pr-10 border rounded"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>


      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
  <option value="user">User</option>
  <option value="admin">Librarian</option> {/* was "Admin" before */}
</select>


        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

      {/* Divider */}
<div className="text-center my-4">OR</div>

{/* Google Sign-In Button */}
<button
  type="button"
  onClick={async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // You can use user.email or user.displayName here
      console.log("Google User:", user);

      // Save to localStorage
      localStorage.setItem("username", user.email);
      localStorage.setItem("fullName", user.displayName);
      localStorage.setItem("userType", "user"); // or determine from email

      // Redirect to user dashboard (you can customize this logic)
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Google Sign-In failed. Try again.");
    }
  }}
  className="w-full bg-red-600 text-white py-2 rounded"
>
  Continue with Google
</button>


        <p className="text-center mt-4">
          Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign Up</a>
        </p>
      </form>

    </div>
  );
};

export default Login;
