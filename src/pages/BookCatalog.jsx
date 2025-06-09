// src/pages/BookCatalog.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
const sampleBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
  { id: 2, title: '1984', author: 'George Orwell', available: false },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true },
];

const BookCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = sampleBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>

      <input
        type="text"
        placeholder="Search by title or author..."
        className="border border-gray-300 px-4 py-2 rounded w-full mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {filteredBooks.map(book => (
    <Link key={book.id} to={`/book/${book.id}`}>
      <div className="border p-4 rounded shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p className="text-gray-600">by {book.author}</p>
        <button
          className={`mt-4 px-4 py-2 rounded ${
            book.available ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          disabled={!book.available}
        >
          {book.available ? 'Borrow' : 'Not Available'}
        </button>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
};

export default BookCatalog;
