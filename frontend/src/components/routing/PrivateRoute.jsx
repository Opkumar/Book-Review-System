"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const PrivateRoute = ({ children }) => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, loading } = authContext

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
