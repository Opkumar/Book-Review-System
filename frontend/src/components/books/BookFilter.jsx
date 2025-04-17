"use client"
import PropTypes from "prop-types"

const genres = [
  { value: "all", label: "All Genres" },
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-Fiction" },
  { value: "mystery", label: "Mystery" },
  { value: "science-fiction", label: "Science Fiction" },
  { value: "fantasy", label: "Fantasy" },
  { value: "romance", label: "Romance" },
  { value: "thriller", label: "Thriller" },
  { value: "biography", label: "Biography" },
  { value: "history", label: "History" },
  { value: "self-help", label: "Self-Help" },
]

const BookFilter = ({ selectedGenre, onFilterChange }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Filters</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <h6 className="mb-2">Genre</h6>
          <div className="list-group">
            {genres.map((genre) => (
              <button
                key={genre.value}
                type="button"
                className={`list-group-item list-group-item-action ${selectedGenre === genre.value ? "active" : ""}`}
                onClick={() => onFilterChange(genre.value)}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

BookFilter.propTypes = {
  selectedGenre: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
}

export default BookFilter
