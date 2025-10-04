"use client"

import { useState, useContext, useEffect } from "react"
import PropTypes from "prop-types"

import Alert from "../layout/Alert"
import ReviewContext from "../../context/ReviewContext"

const EditReview = ({ review, onCancel }) => {
  const reviewContext = useContext(ReviewContext)
  const { updateReview, error, clearErrors } = reviewContext

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    content: "",
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState(false)

  const { rating, title, content } = formData

  // Populate form with existing review on mount
  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating || 0,
        title: review.title || "",
        content: review.content || "",
      })
    }
  }, [review])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (formError) setFormError("")
    if (success) setSuccess(false)
    if (error) clearErrors()
  }

  const setRatingValue = (value) => {
    setFormData({ ...formData, rating: value })
    if (formError) setFormError("")
    if (success) setSuccess(false)
    if (error) clearErrors()
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setFormError("Please select a rating")
      return
    }

    if (content.trim() === "") {
      setFormError("Review content is required")
      return
    }

    setSubmitting(true)

    try {
      await updateReview(review._id, {
        rating,
        title,
        content,
      })

      setSuccess(true)
      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        {error && <Alert type="danger" message={error} />}
        {formError && <Alert type="danger" message={formError} />}
        {success && <Alert type="success" message="Your review has been updated successfully!" />}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="btn p-0 me-1"
                  onClick={() => setRatingValue(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <i
                    className={`fas fa-star fa-lg ${(hoverRating || rating) >= star ? "text-warning" : "text-muted"}`}
                  ></i>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Review Title (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Summarize your thoughts"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Your Review
            </label>
            <textarea
              className="form-control"
              id="content"
              name="content"
              rows="5"
              value={content}
              onChange={onChange}
              placeholder="Share your experience with this book..."
              required
            ></textarea>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => {
                if (onCancel) onCancel()
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || content.trim() === "" || rating === 0}
            >
              {submitting ? "Updating..." : "Update Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

EditReview.propTypes = {
  review: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
}

export default EditReview
