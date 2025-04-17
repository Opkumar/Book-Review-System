import PropTypes from "prop-types"
import ReviewCard from "./ReviewCard"

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-comment fa-3x text-muted mb-3"></i>
        <h3>No reviews yet</h3>
        <p className="text-muted">Be the first to review this book!</p>
      </div>
    )
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  )
}

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
}

export default ReviewList
