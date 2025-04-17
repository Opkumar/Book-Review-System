"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Alert from "../layout/Alert"

const Register = () => {
  const authContext = useContext(AuthContext)
  const { register, error, clearErrors, isAuthenticated } = authContext

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })

  const { name, email, password, password2 } = formData
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate("/")
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (formError) setFormError("")
    if (error) clearErrors()
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== password2) {
      setFormError("Passwords do not match")
    } else {
      setLoading(true)

      await register({
        name,
        email,
        password,
      })

      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Create Account</h2>

            {error && <Alert type="danger" message={error} />}
            {formError && <Alert type="danger" message={formError} />}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>

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

              <div className="mb-3">
                <label htmlFor="password2" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="text-center mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
