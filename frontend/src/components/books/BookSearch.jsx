"use client"

import { useState } from "react"
import PropTypes from "prop-types"

const BookSearch = ({ onSearch, defaultValue = "" }) => {
  const [search, setSearch] = useState(defaultValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(search)
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  )
}

BookSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}

export default BookSearch
