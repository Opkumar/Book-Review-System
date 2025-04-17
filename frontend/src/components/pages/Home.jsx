"use client"

import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import BookContext from "../../context/BookContext"
import BookCard from "../books/BookCard"
import Spinner from "../layout/Spinner"

const Home = () => {
  const bookContext = useContext(BookContext)
  const { featuredBooks, loading, getFeaturedBooks } = bookContext

  useEffect(() => {
    getFeaturedBooks()
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5 mb-5 bg-light rounded">
        <div className="container">
          <h1 className="display-4 mb-4">Discover Your Next Favorite Book</h1>
          <p className="lead mb-4">
            Join our community of book lovers. Read reviews, share your thoughts, and find your next great read.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/books" className="btn btn-primary btn-lg">
              Browse Books
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books mb-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Featured Books</h2>
            <p className="section-description">Explore our handpicked selection of must-read books this month.</p>
          </div>

          <div className="row">
            {featuredBooks.length > 0 ? (
              featuredBooks.map((book) => (
                <div key={book._id} className="col-md-6 col-lg-3 mb-4">
                  <BookCard book={book} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No featured books available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/books" className="btn btn-outline-primary">
              View All Books
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-light rounded">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">Join thousands of readers in our community.</p>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title h5">Discover</h3>
                  <p className="card-text">
                    Browse our extensive collection of books across all genres and find your next great read.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title h5">Review</h3>
                  <p className="card-text">
                    Share your thoughts and opinions on books you've read to help other readers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title h5">Connect</h3>
                  <p className="card-text">
                    Join a community of book lovers and discover new perspectives and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
