"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import ReviewContext from "../../context/ReviewContext"
import AuthContext from "../../context/AuthContext"

const ReviewCard = ({ review, showBook = false }) => {
  const reviewContext = useContext(ReviewContext)
  const authContext = useContext(AuthContext)
  const { markReviewHelpful } = reviewContext
  const { isAuthenticated } = authContext

  const [isMarking, setIsMarking] = useState(false)
  const [isMarked, setIsMarked] = useState(false)

  const handleMarkHelpful = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show a message
      return
    }

    if (isMarked || isMarking) return

    setIsMarking(true)
    try {
      await markReviewHelpful(review._id)
      setIsMarked(true)
    } catch (err) {
      console.error("Error marking review as helpful:", err)
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          {review.user.avatar ? (
            <img
              src={review.user.avatar || "/placeholder.svg"}
              alt={review.user.name}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px" }}
            >
              {review.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <Link to={`/profile/${review.user._id}`} className="fw-bold text-decoration-none">
              {review.user.name}
            </Link>
            <div className="d-flex align-items-center">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${i < review.rating ? "" : "text-muted"}`}
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                ))}
              </div>
              <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        {showBook && (
          <Link to={`/books/${review.book._id}`} className="d-block mb-2 text-decoration-none">
            <small className="text-muted">
              Review for <span className="fw-bold">{review.book.title}</span>
            </small>
          </Link>
        )}
        {review.title && <h5 className="card-title">{review.title}</h5>}
        <p className="card-text">{review.content}</p>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center">
        <small className="text-muted">
          <i className="fas fa-thumbs-up me-1"></i>
          {review.helpfulCount} {review.helpfulCount === 1 ? "person" : "people"} found this helpful
        </small>
        <button
          className={`btn btn-sm ${isMarked ? "btn-success" : "btn-outline-secondary"}`}
          onClick={handleMarkHelpful}
          disabled={isMarking || isMarked}
        >
          {isMarked ? (
            <>
              <i className="fas fa-check me-1"></i> Marked as helpful
            </>
          ) : (
            "Mark as helpful"
          )}
        </button>
      </div>
    </div>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
  showBook: PropTypes.bool,
}

export default ReviewCard
