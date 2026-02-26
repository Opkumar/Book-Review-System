"use client";

import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Modal, Form, Image } from "react-bootstrap";
import axiosInstance from "../../lib/axios";
import BookContext from "../../context/BookContext";

const AdminDashboard = () => {
  const { updateBook } = useContext(BookContext);

  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const initialBookState = {
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedDate: new Date().getFullYear(),
    isbn: "",
    publisher: "",
    pageCount: "",
    coverImage: "",
  };

  const [newBook, setNewBook] = useState(initialBookState);
  const [errors, setErrors] = useState({});

  // 🔹 Fetch books
  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get("/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(Array.isArray(res.data.books) ? res.data.books : res.data);
    } catch (err) {
      console.error("Fetch books error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔹 Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // 🔹 Validation
  const validateForm = () => {
    const formErrors = {};
    if (!newBook.title) formErrors.title = "Title is required";
    if (!newBook.author) formErrors.author = "Author is required";
    if (!newBook.isbn) formErrors.isbn = "ISBN is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // 🔹 Add Book
  const handleAddBook = async () => {
    if (!validateForm()) return;

    try {
      await axiosInstance.post("/api/books", newBook, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setShowAddModal(false);
      setNewBook(initialBookState);
      fetchBooks();
    } catch (err) {
      console.error("Add book error:", err);
    }
  };

  // 🔹 Open Edit Modal
  const handleEditClick = (book) => {
    setEditingBookId(book._id);
    setNewBook({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      description: book.description || "",
      publishedDate: book.publishedDate || new Date().getFullYear(),
      isbn: book.isbn || "",
      publisher: book.publisher || "",
      pageCount: book.pageCount || "",
      coverImage: book.coverImage || "",
    });
    setErrors({});
    setShowEditModal(true);
  };

  // 🔹 Update Book
  const handleUpdateBook = async () => {
    if (!validateForm()) return;

    try {
      await updateBook(editingBookId, newBook);
      setShowEditModal(false);
      setEditingBookId(null);
      setNewBook(initialBookState);
      fetchBooks();
    } catch (err) {
      console.error("Update book error:", err);
    }
  };

  // 🔹 Delete Book
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Delete book error:", err);
    }
  };

  // 🔹 Shared form fields
  const bookFields = [
    {
      label: "Title",
      name: "title",
      type: "text",
      required: true,
      placeholder: "Enter book title",
    },
    {
      label: "Author",
      name: "author",
      type: "text",
      required: true,
      placeholder: "Enter author name",
    },
    {
      label: "Genre",
      name: "genre",
      type: "text",
      placeholder: "e.g. Fiction",
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder: "Book description",
    },
    {
      label: "Published Year",
      name: "publishedDate",
      type: "number",
      placeholder: "e.g. 2023",
    },
    {
      label: "ISBN",
      name: "isbn",
      type: "text",
      required: true,
      placeholder: "ISBN number",
    },
    {
      label: "Publisher",
      name: "publisher",
      type: "text",
      placeholder: "Publisher name",
    },
    {
      label: "Page Count",
      name: "pageCount",
      type: "number",
      placeholder: "Total pages",
    },
    {
      label: "Cover Image URL",
      name: "coverImage",
      type: "text",
      placeholder: "Image URL",
    },
  ];

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add New Book
        </Button>
      </div>

      {/* Books Table */}
      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center shadow-sm">
          <thead className="table-dark">
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
            {books.length ? (
              books.map((book) => (
                <tr key={book._id}>
                  <td>
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        rounded
                        style={{
                          width: "50px",
                          height: "75px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>

                  <td className="fw-semibold">{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {book.genre || "—"}
                    </span>
                  </td>
                  <td className="text-muted">{book.isbn}</td>

                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-muted">
                  No books available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ADD BOOK MODAL */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {bookFields.map(({ label, name, type, required, placeholder }) => (
              <Form.Group className="mb-3" key={name}>
                <Form.Label className="fw-semibold">
                  {label} {required && <span className="text-danger">*</span>}
                </Form.Label>

                {type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={name}
                    placeholder={placeholder}
                    value={newBook[name]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    type={type}
                    name={name}
                    placeholder={placeholder}
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
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT BOOK MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {bookFields.map(({ label, name, type, required, placeholder }) => (
              <Form.Group className="mb-3" key={name}>
                <Form.Label className="fw-semibold">
                  {label} {required && <span className="text-danger">*</span>}
                </Form.Label>

                {type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={name}
                    placeholder={placeholder}
                    value={newBook[name]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    type={type}
                    name={name}
                    placeholder={placeholder}
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdateBook}>
            Update Book
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
