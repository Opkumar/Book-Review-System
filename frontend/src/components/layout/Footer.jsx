import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">&copy; {new Date().getFullYear()} BookReviews. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/terms" className="text-decoration-none text-muted me-3">
              Terms
            </Link>
            <Link to="/privacy" className="text-decoration-none text-muted me-3">
              Privacy
            </Link>
            <Link to="/contact" className="text-decoration-none text-muted">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
