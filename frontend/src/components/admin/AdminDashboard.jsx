import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form, Image } from "react-bootstrap";
import axiosInstance from "../../lib/axios";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedDate: new Date().getFullYear(),
    isbn: "",
    publisher: "",
    pageCount: "",
    coverImage: "", // ✅ Added
  });
  const [errors, setErrors] = useState({});

  // Fetch books from the server
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get("/api/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else if (Array.isArray(res.data.books)) {
          setBooks(res.data.books); // ✅ supports paginated response
        } else {
          console.error("Invalid response format:", res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const validateForm = () => {
    const formErrors = {};
    if (!newBook.title) formErrors.title = "Title is required";
    if (!newBook.author) formErrors.author = "Author is required";
    if (!newBook.isbn) formErrors.isbn = "ISBN is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddBook = async () => {
    if (!validateForm()) return;

    try {
      await axiosInstance.post("/api/books", newBook, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShowAddModal(false);
      setNewBook({
        title: "",
        author: "",
        genre: "",
        description: "",
        publishedDate: new Date().getFullYear(),
        isbn: "",
        publisher: "",
        pageCount: "",
        coverImage: "",
      });
      const res = await axiosInstance.get("/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(Array.isArray(res.data.books) ? res.data.books : res.data);
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Admin Dashboard</h2>

      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        className="mb-3"
      >
        Add New Book
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books?.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      thumbnail
                      style={{
                        width: "50px",
                        height: "75px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>
                  <Button variant="warning" className="me-2">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No books available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for adding a new book */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: "Title", name: "title", type: "text", required: true },
              { label: "Author", name: "author", type: "text", required: true },
              { label: "Genre", name: "genre", type: "text" },
              { label: "Description", name: "description", type: "textarea" },
              {
                label: "Published Date",
                name: "publishedDate",
                type: "number",
              },
              { label: "ISBN", name: "isbn", type: "text", required: true },
              { label: "Publisher", name: "publisher", type: "text" },
              { label: "Page Count", name: "pageCount", type: "number" },
              {
                label: "Cover Image URL",
                name: "coverImage",
                type: "text",
              }, // ✅ Added
            ].map(({ label, name, type, required }) => (
              <Form.Group className="mb-3" key={name}>
                <Form.Label>{label}</Form.Label>
                {type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    name={name}
                    value={newBook[name]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    type={type}
                    name={name}
                    value={newBook[name]}
                    onChange={handleInputChange}
                    isInvalid={!!errors[name]}
                  />
                )}
                {required && errors[name] && (
                  <Form.Control.Feedback type="invalid">
                    {errors[name]}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
