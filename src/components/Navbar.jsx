import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Library Catalog</h1>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          {/* Add more links later */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
