const bookReducer = (state, action) => {
  switch (action.type) {
    case "GET_BOOKS":
      return {
        ...state,
        books: action.payload.books,
        totalBooks: action.payload.totalBooks,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        loading: false,
      }
    case "GET_FEATURED_BOOKS":
      return {
        ...state,
        featuredBooks: action.payload,
        loading: false,
      }
    case "GET_BOOK":
      return {
        ...state,
        book: action.payload,
        loading: false,
      }
    case "ADD_BOOK":
      return {
        ...state,
        books: [action.payload, ...state.books],
        loading: false,
      }
    case "UPDATE_BOOK":
      return {
        ...state,
        books: state.books.map((book) => (book._id === action.payload._id ? action.payload : book)),
        book: action.payload,
        loading: false,
      }
    case "DELETE_BOOK":
      return {
        ...state,
        books: state.books.filter((book) => book._id !== action.payload),
        loading: false,
      }
    case "CLEAR_BOOK":
      return {
        ...state,
        book: null,
        loading: false,
      }
    case "BOOK_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      }
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export default bookReducer
