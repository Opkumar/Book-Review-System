"use client"

import { useContext, useEffect, useState } from "react"
import BookContext from "../../context/BookContext"
import BookCard from "../books/BookCard"
import BookFilter from "../books/BookFilter"
import BookSearch from "../books/BookSearch"
import Pagination from "../layout/Pagination"
import Spinner from "../layout/Spinner"
import Alert from "../layout/Alert"

const Books = () => {
  const bookContext = useContext(BookContext)
  const { books, loading, error, totalPages, currentPage, getBooks } = bookContext

  const [searchParams, setSearchParams] = useState({
    search: "",
    genre: "all",
    sort: "newest",
    page: 1,
  })

  useEffect(() => {
    getBooks(searchParams.page, 12, searchParams.search, searchParams.genre, searchParams.sort)
    // eslint-disable-next-line
  }, [searchParams])

  const handleSearch = (search) => {
    setSearchParams({ ...searchParams, search, page: 1 })
  }

  const handleFilterChange = (genre) => {
    setSearchParams({ ...searchParams, genre, page: 1 })
  }

  const handleSortChange = (sort) => {
    setSearchParams({ ...searchParams, sort, page: 1 })
  }

  const handlePageChange = (page) => {
    setSearchParams({ ...searchParams, page })
    window.scrollTo(0, 0)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="books-page">
      <div className="row">
        {/* Sidebar with filters */}
        <div className="col-md-3 mb-4">
          <BookFilter selectedGenre={searchParams.genre} onFilterChange={handleFilterChange} />
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Books</h1>
            <BookSearch onSearch={handleSearch} defaultValue={searchParams.search} />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">{books.length > 0 ? `Showing ${books.length} books` : "No books found"}</p>
            <div className="sort-dropdown">
              <select
                className="form-select"
                value={searchParams.sort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {error && <Alert type="danger" message={error} />}

          {books.length > 0 ? (
            <div className="row">
              {books.map((book) => (
                <div key={book._id} className="col-sm-6 col-lg-4 mb-4">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h3>No books found</h3>
              <p className="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Books
