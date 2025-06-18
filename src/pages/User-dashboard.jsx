import React, { useState, useEffect, useCallback } from "react";
import BASE_URL from "../api";

const UserDashboard = () => {
  const [profile, setProfile] = useState({
    fullName: "Loading...",
    username: "",
    email: "",
  });

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [myBooks, setMyBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("all_books");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/dashboard/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile({
          fullName: data.fullName || "User",
          username: data.username || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const fetchAllBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/dashboard/user/all_books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("All books API response:", data);
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

 const fetchMyBooks = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/dashboard/user/my_books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("My books API response:", data);
    setMyBooks(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch my books:", err);
    setMyBooks([]);
  } finally {
    setLoading(false);
  }
}, [token]);


  const searchBooks = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      let fieldMap = {
        title: "name",
        author: "author",
        genre: "category",
      };
      const backendField = fieldMap[searchField] || "name";

      const endpoint = `${BASE_URL}/dashboard/user/search_book/${backendField}/${encodedQuery}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Search books response:", data);

      if (Array.isArray(data)) {
        setBooks(data);
      } else if (Array.isArray(data.books)) {
        setBooks(data.books);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchField, token]);

  useEffect(() => {
    if (activeTab === "all_books") fetchAllBooks();
    else if (activeTab === "mybooks") fetchMyBooks();
    else if (activeTab === "search") searchBooks();
  }, [activeTab, fetchAllBooks, fetchMyBooks, searchBooks]);

  useEffect(() => {
    if (activeTab === "search" && searchQuery.trim()) {
      const delayDebounce = setTimeout(() => {
        searchBooks();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, activeTab, searchBooks]);

  const requestBook = async (bookId) => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/user/request_book/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to request book");

      alert("Book request sent successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

const renderMyBooks = () => (
  <>
    {loading ? (
      <p>Loading your books...</p>
    ) : myBooks.length === 0 ? (
      <p>No books issued.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2">
        {myBooks.map((book) => (
          <div
            key={book.book_transaction_id}
            className="border p-4 rounded-lg shadow bg-white"
          >
            <h3 className="text-lg font-semibold mb-1">
              <span className="text-gray-600">Book ID:</span> {book.book_id}
            </h3>
            <p className="text-sm text-gray-800">
              <strong>Issued To:</strong> {book.username}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Issue Date:</strong> {book.issue_date}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Expire Date:</strong> {book.expire_date}
            </p>
            <p className="text-sm mt-2">
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  book.status === "Approved"
                    ? "text-green-600"
                    : book.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {book.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    )}
  </>
);




  const renderBooks = (bookList) => (
    <>
      {loading ? (
        <p>Loading books...</p>
      ) : bookList.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
          {bookList.map((book) => (
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
              <button
                disabled={book.number_of_available_copies <= 0}
                onClick={() => requestBook(book.book_id)}
                className={`px-4 py-2 rounded text-white font-medium mt-3 ${
                  book.number_of_available_copies > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Request Book
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <nav className="flex justify-center gap-8 mb-6 text-lg font-semibold">
        {["all_books", "search", "mybooks", "profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </nav>

      {activeTab === "all_books" && (
        <>
          <h2 className="text-xl font-semibold mb-4">All Books</h2>
          {renderBooks(books)}
        </>
      )}

     {activeTab === "mybooks" && (
  <>
    <h2 className="text-xl font-semibold mb-4">My Books</h2>
    {renderMyBooks()}
  </>
)}


      {activeTab === "search" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Search Books</h2>
          <div className="flex gap-4 mb-4">
            <select
              className="border px-3 py-1 rounded"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchField}`}
              className="border px-3 py-1 rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {renderBooks(books)}
        </>
      )}

      {activeTab === "profile" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="border rounded-lg p-4 bg-white shadow-sm max-w-md mx-auto">
            <p>
              <strong>Full Name:</strong> {profile.fullName}
            </p>
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
