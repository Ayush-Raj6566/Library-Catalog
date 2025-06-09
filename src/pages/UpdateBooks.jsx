import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";  // assuming you use react-router for navigation

const UpdateBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAllBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://humor-abilities-later-vcr.trycloudflare.com/dashboard/user/all_books",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("All books API response:", data); // 👈 Debug log
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllBooks();
  }, [fetchAllBooks]);

  const handleUpdate = (bookId) => {
    // Navigate to a separate update book page with bookId as param or query
    navigate(`/librarian-dashboard/admin/update_book/${bookId}`);
  };

  const handleDelete = async (bookId) => {
  if (!window.confirm("Are you sure you want to delete this book?")) return;

  try {
    const res = await fetch(
      `https://humor-abilities-later-vcr.trycloudflare.com/dashboard/admin/delete_book/${bookId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to delete book");
    }

    alert("Book deleted successfully!");
    // Remove the deleted book from the state
    setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== bookId));
  } catch (err) {
    alert("Error: " + err.message);
  }
};


  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Update Books</h2>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
          {books.map((book) => (
            <div
              key={book.book_id}
              className="border p-4 rounded-lg shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-1">{book.name}</h3>
                <p className="text-sm text-gray-700">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p className="text-sm mt-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      book.number_of_available_copies > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {book.number_of_available_copies > 0
                      ? "Available"
                      : "Issued"}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleUpdate(book.book_id)}
                  className="flex-1 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                >
                  Update Book
                </button>
                <button
                  onClick={() => handleDelete(book.book_id)}
                  className="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Delete Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateBooks;
