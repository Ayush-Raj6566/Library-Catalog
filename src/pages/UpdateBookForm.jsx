import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBookForm = () => {
  const { bookId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    genre: "",
    number_of_pages: "",
    publish_data: "",
    publication: "",
    number_of_available_copies: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {};
    for (const key in formData) {
      if (formData[key].toString().trim() !== "") {
        cleanedData[key] = isNaN(formData[key]) ? formData[key] : parseInt(formData[key]);
      }
    }

    if (Object.keys(cleanedData).length === 0) {
      alert("Please enter at least one field to update.");
      return;
    }

    try {
      const res = await fetch(
        `https://humor-abilities-later-vcr.trycloudflare.com/dashboard/admin/update_book/${bookId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update book");
      alert("Book updated successfully");
      navigate("/librarian-dashboard/admin/update_books");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Update Book</h2>

      <label className="block mb-2">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter new name (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Author:
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter new author (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Genre:
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Enter new genre (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Number of Pages:
        <input
          type="number"
          name="number_of_pages"
          value={formData.number_of_pages}
          onChange={handleChange}
          placeholder="Enter new page count (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Publish Date:
        <input
          type="date"
          name="publish_data"
          value={formData.publish_data}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Publication:
        <input
          type="text"
          name="publication"
          value={formData.publication}
          onChange={handleChange}
          placeholder="Enter publication (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Number of Available Copies:
        <input
          type="number"
          name="number_of_available_copies"
          value={formData.number_of_available_copies}
          onChange={handleChange}
          placeholder="Enter available copies (optional)"
          className="w-full p-2 border rounded"
        />
      </label>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default UpdateBookForm;
