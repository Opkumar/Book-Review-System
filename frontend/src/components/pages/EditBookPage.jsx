"use client";

import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookContext from "../../context/BookContext";
import AuthContext from "../../context/AuthContext";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import EditBook from "../books/EditBook";


function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { book, loading, error, getBook } = useContext(BookContext);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    getBook(id);
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <Spinner />;

  if (error) return <Alert type="danger" message={error} />;

  if (!book) return <Alert type="danger" message="Book not found" />;

  // Only creator can edit
  if (!isAuthenticated || book.createdBy !== user._id) {
    return <Alert type="danger" message="You are not authorized to edit this book." />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Book</h2>
      <EditBook
        book={book}
        onCancel={() => navigate(`/books/${book._id}`)}
        onSuccess={() => navigate(`/books/${book._id}`)}
      />
    </div>
  );
}

export default EditBookPage;
