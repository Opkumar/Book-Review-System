"use client"

import React, { useState, useContext } from "react"
import { Button } from "react-bootstrap"
import BookContext from "../../context/BookContext"

function AddBookForm() {
  const { addBook, error, loading } = useContext(BookContext)

  const [submitting, setSubmitting] = useState(false)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedDate: new Date().getFullYear(),
    isbn: "",
    publisher: "",
    pageCount: "",
    coverImage: "",
  })
  const [errors, setErrors] = useState({})

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBook({ ...newBook, [name]: value })
  }

  // Form validation
  const validateForm = () => {
    const formErrors = {}
    if (!newBook.title) formErrors.title = "Title is required"
    if (!newBook.author) formErrors.author = "Author is required"
    if (!newBook.isbn) formErrors.isbn = "ISBN is required"
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitting(true)

    try {
      await addBook(newBook)

      // Reset form
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
      })
    } catch (err) {
      console.error("Error adding book:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          name="title"
          value={newBook.title}
          onChange={handleInputChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* Author */}
      <div className="mb-3">
        <label className="form-label">Author</label>
        <input
          type="text"
          className={`form-control ${errors.author ? "is-invalid" : ""}`}
          name="author"
          value={newBook.author}
          onChange={handleInputChange}
        />
        {errors.author && <div className="invalid-feedback">{errors.author}</div>}
      </div>

      {/* Genre */}
      <div className="mb-3">
        <label className="form-label">Genre</label>
        <input
          type="text"
          className="form-control"
          name="genre"
          value={newBook.genre}
          onChange={handleInputChange}
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={newBook.description}
          onChange={handleInputChange}
        ></textarea>
      </div>

      {/* Published Year */}
      <div className="mb-3">
        <label className="form-label">Published Year</label>
        <input
          type="number"
          className="form-control"
          name="publishedDate"
          value={newBook.publishedDate}
          onChange={handleInputChange}
        />
      </div>

      {/* ISBN */}
      <div className="mb-3">
        <label className="form-label">ISBN</label>
        <input
          type="text"
          className={`form-control ${errors.isbn ? "is-invalid" : ""}`}
          name="isbn"
          value={newBook.isbn}
          onChange={handleInputChange}
        />
        {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
      </div>

      {/* Publisher */}
      <div className="mb-3">
        <label className="form-label">Publisher</label>
        <input
          type="text"
          className="form-control"
          name="publisher"
          value={newBook.publisher}
          onChange={handleInputChange}
        />
      </div>

      {/* Page Count */}
      <div className="mb-3">
        <label className="form-label">Page Count</label>
        <input
          type="number"
          className="form-control"
          name="pageCount"
          value={newBook.pageCount}
          onChange={handleInputChange}
        />
      </div>

      {/* Cover Image */}
      <div className="mb-3">
        <label className="form-label">Cover Image URL</label>
        <input
          type="text"
          className="form-control"
          name="coverImage"
          value={newBook.coverImage}
          onChange={handleInputChange}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary" disabled={submitting || loading}>
          {submitting || loading ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Global error */}
      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  )
}

export default AddBookForm
