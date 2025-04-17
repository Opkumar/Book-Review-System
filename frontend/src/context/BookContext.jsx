"use client"

import { createContext, useReducer } from "react"
import axiosInstance from "../lib/axios"
import bookReducer from "../reducers/bookReducer"

const BookContext = createContext()

export const BookProvider = ({ children }) => {
  const initialState = {
    books: [],
    book: null,
    featuredBooks: [],
    loading: false,
    error: null,
    totalBooks: 0,
    totalPages: 0,
    currentPage: 1,
  }

  const [state, dispatch] = useReducer(bookReducer, initialState)

  // Get all books with pagination, search, and filter
  const getBooks = async (page = 1, limit = 12, search = "", genre = "", sort = "newest") => {
    try {
      dispatch({ type: "SET_LOADING" })

      const res = await axiosInstance.get(`/api/books?page=${page}&limit=${limit}&search=${search}&genre=${genre}&sort=${sort}`)

      dispatch({
        type: "GET_BOOKS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Get featured books
  const getFeaturedBooks = async () => {
    try {
      dispatch({ type: "SET_LOADING" })

      const res = await axiosInstance.get("/api/books/featured")

      dispatch({
        type: "GET_FEATURED_BOOKS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Get book by ID
  const getBook = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" })

      const res = await axiosInstance.get(`/api/books/${id}`)

      dispatch({
        type: "GET_BOOK",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Add new book (admin only)
  const addBook = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axiosInstance.post("/api/books", formData, config)

      dispatch({
        type: "ADD_BOOK",
        payload: res.data,
      })

      return res.data
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
      throw err
    }
  }

  // Update book (admin only)
  const updateBook = async (id, formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.put(`/api/books/${id}`, formData, config)

      dispatch({
        type: "UPDATE_BOOK",
        payload: res.data,
      })

      return res.data
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
      throw err
    }
  }

  // Delete book (admin only)
  const deleteBook = async (id) => {
    try {
      await axios.delete(`/api/books/${id}`)

      dispatch({
        type: "DELETE_BOOK",
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: "BOOK_ERROR",
        payload: err.response.data.msg,
      })
    }
  }

  // Clear current book
  const clearBook = () => {
    dispatch({ type: "CLEAR_BOOK" })
  }

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" })
  }

  return (
    <BookContext.Provider
      value={{
        books: state.books,
        book: state.book,
        featuredBooks: state.featuredBooks,
        loading: state.loading,
        error: state.error,
        totalBooks: state.totalBooks,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        getBooks,
        getFeaturedBooks,
        getBook,
        addBook,
        updateBook,
        deleteBook,
        clearBook,
        clearErrors,
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export default BookContext
