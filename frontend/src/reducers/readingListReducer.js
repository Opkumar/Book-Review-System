export const readingListReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_READING_LIST_START":
      return { ...state, loading: true, error: null };
    case "FETCH_READING_LIST_SUCCESS":
      return { ...state, loading: false, readingList: action.payload };
    case "FETCH_READING_LIST_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_READING_LIST_ENTRY":
      return { ...state, readingList: [...state.readingList, action.payload] };
    case "UPDATE_READING_LIST_ENTRY":
      return {
        ...state,
        readingList: state.readingList.map((entry) =>
          entry._id === action.payload._id ? action.payload : entry
        ),
      };
    case "DELETE_READING_LIST_ENTRY":
      return {
        ...state,
        readingList: state.readingList.filter((entry) => entry._id !== action.payload),
      };
    default:
      return state;
  }
};
