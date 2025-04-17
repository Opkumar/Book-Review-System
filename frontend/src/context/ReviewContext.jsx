"use client"

import { createContext, useReducer } from "react"
import axiosInstance from "../lib/axios"
import reviewReducer from "../reducers/reviewReducer"

const ReviewContext = createContext()

export const ReviewProvider = ({ children }) => {
  const initialState = {
    reviews: [],
    userReviews: [],
    loading: false,
    error: null,
  }

  const [state, dispatch] = useReducer(reviewReducer, initialState)

  // Get reviews for a book
  const getBookReviews = async (bookId) => {
    try {
      dispatch({ type: "SET_LOADING" })

      const res = await axiosInstance.get(`/api/reviews?bookId=${bookId}`)

      dispatch({
        type: "GET_BOOK_REVIEWS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Get reviews by a user
  const getUserReviews = async (userId) => {
    try {
      dispatch({ type: "SET_LOADING" })

      const res = await axiosInstance.get(`/api/reviews?userId=${userId}`)

      dispatch({
        type: "GET_USER_REVIEWS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Add a review
  const addReview = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axiosInstance.post("/api/reviews", formData, config)

      dispatch({
        type: "ADD_REVIEW",
        payload: res.data,
      })

      return res.data
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
      throw err
    }
  }

  // Update a review
  const updateReview = async (id, formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.put(`/api/reviews/${id}`, formData, config)

      dispatch({
        type: "UPDATE_REVIEW",
        payload: res.data,
      })

      return res.data
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
      throw err
    }
  }

  // Delete a review
  const deleteReview = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`)

      dispatch({
        type: "DELETE_REVIEW",
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Mark review as helpful
  const markReviewHelpful = async (reviewId) => {
    try {
      const res = await axios.put(`/api/reviews/${reviewId}/helpful`)

      dispatch({
        type: "MARK_HELPFUL",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "REVIEW_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" })
  }

  return (
    <ReviewContext.Provider
      value={{
        reviews: state.reviews,
        userReviews: state.userReviews,
        loading: state.loading,
        error: state.error,
        getBookReviews,
        getUserReviews,
        addReview,
        updateReview,
        deleteReview,
        markReviewHelpful,
        clearErrors,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export default ReviewContext
