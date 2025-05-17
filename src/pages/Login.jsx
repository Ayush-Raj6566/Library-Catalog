import React, { useState } from "react";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", credentials);
    // Placeholder: Add login logic here later
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input 
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-sm text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

      <button
  type="button"
  onClick={() => alert('Forgot Password clicked!')}
  className="text-blue-600 underline text-sm"
>
  Forgot Password?
</button>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
