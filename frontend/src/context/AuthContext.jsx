import { createContext, useReducer, useEffect } from "react"
import axiosInstance from "../lib/axios"
import authReducer from "../reducers/authReducer"
import setAuthToken from "../utils/setAuthToken"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load User function (used on mount and after login/register)
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      const res = await axiosInstance.get("/api/auth")
      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      })
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  // Register User
  const register = async (formData) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    }

    try {
      const res = await axiosInstance.post("/api/users", formData, config)
      setAuthToken(res.data.token)

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      })

      loadUser()
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: err.response?.data?.msg || "Something went wrong",
      })
    }
  }

  // Login User
  const login = async (formData) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    }

    try {
      const res = await axiosInstance.post("/api/auth", formData, config)
      console.log(res.data.token);
      
      setAuthToken(res.data.token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      })

      loadUser()
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: err.response?.data?.msg || "Something went wrong",
      })
    }
  }

  // Logout
  const logout = () => {
    setAuthToken(null)
    dispatch({ type: "LOGOUT" })
  }

  // Clear Errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" })

  // Update Profile
  const updateProfile = async (formData) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    }

    try {
      const res = await axiosInstance.put(`/api/users/${state.user._id}`, formData, config)
      dispatch({
        type: "UPDATE_PROFILE_SUCCESS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "UPDATE_PROFILE_FAIL",
        payload: err.response?.data?.msg || "Update failed",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
