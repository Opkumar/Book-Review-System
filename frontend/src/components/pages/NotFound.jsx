"use client";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container container d-flex flex-column flex-md-row align-items-center justify-content-center text-center text-md-start py-5">
      <div className="not-found-content me-md-4 mb-4 mb-md-0">
        <h1 className="error-code display-1 fw-bold text-primary">404</h1>
        <h2 className="error-title h2 mb-3">Page Not Found</h2>
        <p className="error-message lead text-secondary mb-4">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="error-actions d-flex gap-3 justify-content-center justify-content-md-start">
          <Link to="/" className="btn btn-primary px-4">
            Go to Homepage
          </Link>
          <button className="btn btn-outline-primary px-4" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
      <div className="not-found-illustration">
        <img src="/placeholder.svg?height=300&width=300" alt="Page not found illustration" className="img-fluid" />
      </div>
    </div>
  );
};

export default NotFound;
