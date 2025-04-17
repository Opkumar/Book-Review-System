import { useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const Navbar = () => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, user, logout } = authContext

  const onLogout = () => {
    logout()
  }

  const authLinks = (
    <ul className="navbar-nav ms-auto">
      {user && user.role === "admin" && (
        <li className="nav-item">
          <Link className="nav-link" to="/admin">
            <i className="fas fa-cog me-1"></i>
            Admin
          </Link>
        </li>
      )}
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#!"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-user me-1"></i>
          {user && user.name}
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <Link className="dropdown-item" to={`/profile/${user && user._id}`}>
              <i className="fas fa-user-circle me-1"></i>
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#!" onClick={onLogout}>
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Register
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-book me-2"></i>
          BookReviews
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                Books
              </Link>
            </li>
          </ul>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
