import React, { useState } from "react";

const AddBooks = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [numberOfPages, setNumberOfPages] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publication, setPublication] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://ef51-49-42-177-117.ngrok-free.app/dashboard/admin/add_book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          author,
          genre,
          number_of_pages: parseInt(numberOfPages),
          publish_data: publishDate,
          publication,
          number_of_available_copies: parseInt(availableCopies)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Book added successfully!");
        setName("");
        setAuthor("");
        setGenre("");
        setNumberOfPages("");
        setPublishDate("");
        setPublication("");
        setAvailableCopies("");
      } else {
        setMessage(data.detail || "Failed to add book.");
      }
    } catch (err) {
      console.error("Add book error:", err);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Book Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          className="w-full p-2 border rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of Pages"
          className="w-full p-2 border rounded"
          value={numberOfPages}
          onChange={(e) => setNumberOfPages(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Publish Date"
          className="w-full p-2 border rounded"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Publication"
          className="w-full p-2 border rounded"
          value={publication}
          onChange={(e) => setPublication(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of Available Copies"
          className="w-full p-2 border rounded"
          value={availableCopies}
          onChange={(e) => setAvailableCopies(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Book
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default AddBooks;
