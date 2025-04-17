"use client"

import { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import BookContext from "../../context/BookContext"
import ReviewContext from "../../context/ReviewContext"
import AuthContext from "../../context/AuthContext"
import ReviewForm from "../reviews/ReviewForm"
import ReviewList from "../reviews/ReviewList"
import BookCard from "../books/BookCard"
import Spinner from "../layout/Spinner"
import Alert from "../layout/Alert"

const BookDetails = () => {
  const { id } = useParams()
  const bookContext = useContext(BookContext)
  const reviewContext = useContext(ReviewContext)
  const authContext = useContext(AuthContext)

  const { book, loading: bookLoading, error: bookError, getBook } = bookContext
  const { reviews, loading: reviewLoading, getBookReviews } = reviewContext
  const { isAuthenticated, user } = authContext

  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    getBook(id)
    getBookReviews(id)
    // eslint-disable-next-line
  }, [id])

  if (bookLoading || reviewLoading) {
    return <Spinner />
  }

  if (bookError) {
    return <Alert type="danger" message={bookError} />
  }

  if (!book) {
    return <Alert type="danger" message="Book not found" />
  }

  return (
    <div className="book-details-page">
      <div className="row">
        {/* Book cover and actions */}
        <div className="col-md-3 mb-4">
          <div className="sticky-top pt-3">
            <div className="book-cover mb-3">
              <img
                src={book.coverImage || "https://via.placeholder.com/300x450"}
                alt={book.title}
                className="img-fluid rounded"
              />
            </div>
            <div className="book-actions">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-star text-warning me-1"></i>
                  <span className="fw-bold">{book.averageRating.toFixed(1)}</span>
                  <span className="text-muted ms-1">({book.reviewCount} reviews)</span>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <i className="fas fa-book me-1"></i>
                  <span>{book.pageCount} pages</span>
                </div>
              </div>
              <button className="btn btn-primary w-100 mb-2">Add to Reading List</button>
              {isAuthenticated ? (
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => document.getElementById("write-review").scrollIntoView({ behavior: "smooth" })}
                >
                  Write a Review
                </button>
              ) : (
                <Link to={`/login?redirect=/books/${book._id}`} className="btn btn-outline-primary w-100">
                  Sign in to Review
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Book details and reviews */}
        <div className="col-md-9">
          <div className="book-info mb-4">
            <h1 className="book-title mb-1">{book.title}</h1>
            <p className="book-author text-muted mb-3">by {book.author}</p>

            <div className="book-meta d-flex flex-wrap gap-3 mb-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-calendar me-1"></i>
                <span>Published: {new Date(book.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-bookmark me-1"></i>
                <span>Genre: {book.genre}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-barcode me-1"></i>
                <span>ISBN: {book.isbn}</span>
              </div>
            </div>

            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
              </li>
            </ul>

            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === "description" ? "show active" : ""}`}>
                <p>{book.description}</p>
              </div>
              <div className={`tab-pane fade ${activeTab === "details" ? "show active" : ""}`}>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Publisher:</strong> {book.publisher}
                    </p>
                    <p>
                      <strong>Language:</strong> {book.language}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Pages:</strong> {book.pageCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div id="reviews" className="book-reviews mb-4">
            <h2 className="h4 mb-4">Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>

          {isAuthenticated && (
            <div id="write-review" className="write-review mt-5">
              <h2 className="h4 mb-3">Write a Review</h2>
              <ReviewForm bookId={book._id} />
            </div>
          )}
        </div>
      </div>

      {/* Related books */}
      {book.relatedBooks && book.relatedBooks.length > 0 && (
        <div className="related-books mt-5">
          <h2 className="h4 mb-4">You Might Also Like</h2>
          <div className="row">
            {book.relatedBooks.map((relatedBook) => (
              <div key={relatedBook._id} className="col-md-3 col-sm-6 mb-4">
                <BookCard book={relatedBook} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookDetails
