"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Alert from "../layout/Alert"

const Login = () => {
  const authContext = useContext(AuthContext)
  const { login, error, clearErrors, isAuthenticated } = authContext

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { email, password } = formData
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Get redirect path from URL query params
  const searchParams = new URLSearchParams(location.search)
  const redirectTo = searchParams.get("redirect") || "/"

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(redirectTo)
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) clearErrors()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await login({
      email,
      password,
    })

    setLoading(false)
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Sign In</h2>

            {error && <Alert type="danger" message={error} />}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-center mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
