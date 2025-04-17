const reviewReducer = (state, action) => {
  switch (action.type) {
    case "GET_BOOK_REVIEWS":
      return {
        ...state,
        reviews: action.payload,
        loading: false,
      }
    case "GET_USER_REVIEWS":
      return {
        ...state,
        userReviews: action.payload,
        loading: false,
      }
    case "ADD_REVIEW":
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        loading: false,
      }
    case "UPDATE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map((review) => (review._id === action.payload._id ? action.payload : review)),
        userReviews: state.userReviews.map((review) => (review._id === action.payload._id ? action.payload : review)),
        loading: false,
      }
    case "DELETE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.filter((review) => review._id !== action.payload),
        userReviews: state.userReviews.filter((review) => review._id !== action.payload),
        loading: false,
      }
    case "MARK_HELPFUL":
      return {
        ...state,
        reviews: state.reviews.map((review) => (review._id === action.payload._id ? action.payload : review)),
        loading: false,
      }
    case "REVIEW_ERROR":
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

export default reviewReducer
