import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";
import { ReviewProvider } from "./context/ReviewContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./components/pages/Home";
import Books from "./components/pages/Books";
import BookDetails from "./components/pages/BookDetails";
import Profile from "./components/pages/Profile";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/pages/NotFound";
import "./App.css";
import { ReadingListProvider } from "./context/ReadingListContext";

import EditBookPage from "./components/pages/EditBookPage";
import Terms from "./components/pages/Terms";
import Privacy from "./components/pages/Privacy";
import Contact from "./components/pages/Contact";

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <ReviewProvider>
          <ReadingListProvider>
          <div className="app-container">
            <Navbar />
            <main className="container py-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile/:id"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/books/edit/:id"
                  element={
                    <PrivateRoute>
                      <EditBookPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </ReadingListProvider>
        </ReviewProvider>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
