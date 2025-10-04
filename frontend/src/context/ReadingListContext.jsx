import React, { createContext, useReducer, useContext } from "react";
import axiosInstance from "../lib/axios";
import { readingListReducer } from "../reducers/readingListReducer";

// Create context
const ReadingListContext = createContext();

export const ReadingListProvider = ({ children }) => {
  const initialState = { readingList: [], loading: false, error: null };
  const [state, dispatch] = useReducer(readingListReducer, initialState);

  // Fetch all reading list entries
  const fetchReadingList = async (userId) => {
    dispatch({ type: "FETCH_READING_LIST_START" });
    try {
      const url = userId ? `/reading-list?user=${userId}` : "/reading-list";
      const res = await axiosInstance.get(url);
      dispatch({ type: "FETCH_READING_LIST_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "FETCH_READING_LIST_ERROR", payload: err.message });
    }
  };

  // Add a new entry
  const addReadingListEntry = async (user, book) => {
    try {
      const res = await axiosInstance.post("/api/reading-list", { user, book });
      dispatch({ type: "ADD_READING_LIST_ENTRY", payload: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data || { error: err.message };
    }
  };

  // Update an entry
  const updateReadingListEntry = async (id, book) => {
    try {
      const res = await axiosInstance.put(`/api/reading-list/${id}`, { book });
      dispatch({ type: "UPDATE_READING_LIST_ENTRY", payload: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data || { error: err.message };
    }
  };

  // Delete an entry
  const deleteReadingListEntry = async (id) => {
    try {
      await axiosInstance.delete(`/api/reading-list/${id}`);
      dispatch({ type: "DELETE_READING_LIST_ENTRY", payload: id });
    } catch (err) {
      throw err.response?.data || { error: err.message };
    }
  };

  return (
    <ReadingListContext.Provider
      value={{
        ...state,
        fetchReadingList,
        addReadingListEntry,
        updateReadingListEntry,
        deleteReadingListEntry,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
};

// Custom hook
export const useReadingList = () => useContext(ReadingListContext);
