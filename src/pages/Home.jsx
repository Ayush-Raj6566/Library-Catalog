import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      {/* Banner Image */}
      <img 
        src="https://images.unsplash.com/photo-1512820790803-83ca734da794" 
        alt="Library Banner"
        className="w-full max-h-[300px] object-cover rounded-lg shadow-md mb-6"
      />

      {/* Welcome Text */}
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Library</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        Discover a world of knowledge. Borrow books, manage your account, and connect with our library system.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow">
            Sign Up
          </button>
        </Link>

        <button className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow">
          Browse Books
        </button>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow">
          Join as a Member
        </button>
      </div>
    </div>
  );
};

export default Home;
