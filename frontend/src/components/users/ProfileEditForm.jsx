"use client"

import { useState, useContext } from "react"
import PropTypes from "prop-types"
import AuthContext from "../../context/AuthContext"
import Alert from "../layout/Alert"

const ProfileEditForm = ({ user, onCancel, onSuccess }) => {
  const authContext = useContext(AuthContext)
  const { updateProfile, error, clearErrors } = authContext

  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const { name, bio, avatar } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    if (formError) setFormError("")
    if (error) clearErrors()
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (name.trim() === "") {
      setFormError("Name is required")
      return
    }

    setSubmitting(true)

    try {
      await updateProfile(formData)
      setSubmitting(false)
      onSuccess()
    } catch (err) {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <Alert type="danger" message={error} />}
      {formError && <Alert type="danger" message={formError} />}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input type="text" className="form-control" id="name" name="name" value={name} onChange={onChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="avatar" className="form-label">
          Profile Picture URL
        </label>
        <input
          type="text"
          className="form-control"
          id="avatar"
          name="avatar"
          value={avatar}
          onChange={onChange}
          placeholder="https://example.com/avatar.jpg"
        />
        <div className="form-text">Enter a URL for your profile picture</div>
      </div>

      <div className="mb-3">
        <label htmlFor="bio" className="form-label">
          Bio
        </label>
        <textarea
          className="form-control"
          id="bio"
          name="bio"
          rows="4"
          value={bio}
          onChange={onChange}
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting || name.trim() === ""}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}

ProfileEditForm.propTypes = {
  user: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default ProfileEditForm
