"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const AdminRoute = ({ children }) => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, loading, user } = authContext

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute
