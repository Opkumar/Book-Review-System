"use client"
import PropTypes from "prop-types"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current
      const leftSiblingIndex = Math.max(currentPage - 1, 1)
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

      // Whether to show dots
      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Show first few pages
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push(-1) // Dots
        pages.push(totalPages)
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show last few pages
        pages.push(1)
        pages.push(-1) // Dots
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show middle pages
        pages.push(1)
        pages.push(-1) // Dots
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push(-1) // Dots
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {pageNumbers.map((page, i) =>
          page === -1 ? (
            <li key={`dots-${i}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ),
        )}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
