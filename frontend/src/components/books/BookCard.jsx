import { Link } from "react-router-dom"
import PropTypes from "prop-types"

const BookCard = ({ book }) => {
  return (
    <div className="card h-100 book-card">
      <Link to={`/books/${book._id}`} className="text-decoration-none">
        <div className="book-cover">
          <img
            src={book.coverImage || "https://via.placeholder.com/300x450"}
            alt={book.title}
            className="card-img-top"
            style={{ height: "250px", objectFit: "cover" }}
          />
          {book.featured && (
            <div className="featured-badge">
              <span className="badge bg-warning text-dark">
                <i className="fas fa-star me-1"></i>
                Featured
              </span>
            </div>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate">{book.title}</h5>
          <p className="card-text text-muted text-truncate">{book.author}</p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="fas fa-star text-warning me-1"></i>
            <span>{book.averageRating.toFixed(1)}</span>
          </div>
          <div className="d-flex align-items-center text-muted">
            <i className="fas fa-comment me-1"></i>
            <span>{book.reviewCount}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
}

export default BookCard
