import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Librarian-dashboard';
import UserDashboard from './pages/User-dashboard';  // <-- import user dashboard
import BookCatalog from "./pages/BookCatalog";
import BookDetails from "./pages/BookDetails";
import AddBooks from "./pages/AddBooks"; 
import UpdateBooks from "./pages/UpdateBooks"; 
import UpdateBookForm from "./pages/UpdateBookForm";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/librarian-dashboard" element={<Dashboard />} /> {/* Librarian */}
        <Route path="/user-dashboard" element={<UserDashboard />} /> {/* User */}
          <Route path="/librarian-dashboard/admin/add_books" element={<AddBooks />} />
          <Route path="/librarian-dashboard/admin/update_books" element={<UpdateBooks />} />
          <Route path="/librarian-dashboard/admin/update_book/:bookId" element={<UpdateBookForm />}/>

        <Route path="/books" element={<BookCatalog />} />
        <Route path="/book/:id" element={<BookDetails />} />
        
      </Routes>
    </>
  );
}

export default App;
