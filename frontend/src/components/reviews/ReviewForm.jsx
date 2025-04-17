"use client"

import { useState, useContext } from "react"
import PropTypes from "prop-types"
import ReviewContext from "../../context/ReviewContext"
import Alert from "../layout/Alert"

const ReviewForm = ({ bookId }) => {
  const reviewContext = useContext(ReviewContext)
  const { addReview, error, clearErrors } = reviewContext

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

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    if (formError) setFormError("")
    if (success) setSuccess(false)
    if (error) clearErrors()
  }

  const setRating = (value) => {
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
      await addReview({
        bookId,
        rating,
        title,
        content,
      })

      setFormData({
        rating: 0,
        title: "",
        content: "",
      })
      setSuccess(true)
      setSubmitting(false)

      // Scroll to the top of the reviews section
      document.getElementById("reviews").scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        {error && <Alert type="danger" message={error} />}
        {formError && <Alert type="danger" message={formError} />}
        {success && <Alert type="success" message="Your review has been submitted successfully!" />}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="btn p-0 me-1"
                  onClick={() => setRating(star)}
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
                setFormData({
                  rating: 0,
                  title: "",
                  content: "",
                })
                setFormError("")
                if (error) clearErrors()
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || content.trim() === "" || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

ReviewForm.propTypes = {
  bookId: PropTypes.string.isRequired,
}

export default ReviewForm
