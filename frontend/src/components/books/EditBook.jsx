"use client"

import React, { useState, useContext, useEffect } from "react"
import { Button } from "react-bootstrap"
import BookContext from "../../context/BookContext"

function EditBook({ book, onCancel, onSuccess }) {
  const { updateBook, error, loading } = useContext(BookContext)

  const [submitting, setSubmitting] = useState(false)
  const [editBook, setEditBook] = useState({
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

  // Prefill with existing book data
  useEffect(() => {
    if (book) {
      setEditBook({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        description: book.description || "",
        publishedDate: new Date(book.publishedDate).getFullYear(),
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        pageCount: book.pageCount || "",
        coverImage: book.coverImage || "",
      })
    }
  }, [book])

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditBook({ ...editBook, [name]: value })
  }

  // Form validation
  const validateForm = () => {
    const formErrors = {}
    if (!editBook.title) formErrors.title = "Title is required"
    if (!editBook.author) formErrors.author = "Author is required"
    if (!editBook.isbn) formErrors.isbn = "ISBN is required"
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitting(true)

    try {
      await updateBook(book._id, editBook)
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Error updating book:", err)
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
          value={editBook.title}
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
          value={editBook.author}
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
          value={editBook.genre}
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
          value={editBook.description}
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
          value={editBook.publishedDate}
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
          value={editBook.isbn}
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
          value={editBook.publisher}
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
          value={editBook.pageCount}
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
          value={editBook.coverImage}
          onChange={handleInputChange}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting || loading}>
          {submitting || loading ? "Updating..." : "Update"}
        </Button>
      </div>

      {/* Global error */}
      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  )
}

export default EditBook
