import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";
function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Replace with your friend's ngrok URL
    fetch(`${BASE_URL}/book/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error("Error fetching book:", err));
  }, [id]);

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/catalog")}
        className="text-blue-600 underline mb-4"
      >
        &larr; Back to Catalog
      </button>

      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6">
        <img
          src={book.coverImageUrl || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-48 h-64 object-cover mb-4 md:mb-0 md:mr-6"
        />

        <div>
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
          <p className="text-gray-700 mb-1"><strong>Publisher:</strong> {book.publisher}</p>
          <p className="text-gray-700 mb-1"><strong>Year:</strong> {book.year}</p>
          <p className="text-gray-700 mb-1"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="text-gray-700 mb-3"><strong>Description:</strong> {book.description}</p>
          <p className={`font-semibold ${book.availability ? "text-green-600" : "text-red-600"}`}>
            {book.availability ? "Available" : "Issued"}
          </p>

          {book.availability && (
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Issue this Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
