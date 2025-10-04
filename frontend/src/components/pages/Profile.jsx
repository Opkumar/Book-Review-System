"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ReviewContext from "../../context/ReviewContext";
import BookContext from "../../context/BookContext";
import ReviewCard from "../reviews/ReviewCard";
import BookCard from "../books/BookCard";
import ProfileEditForm from "../users/ProfileEditForm";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import axiosInstance from "../../lib/axios";
import AddBook from "../books/AddBook";

const Profile = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { userReviews, loading: reviewLoading, getUserReviews } = useContext(ReviewContext);
  const { loading: bookLoading } = useContext(BookContext);

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddBook, setIsAddBook] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axiosInstance(`/api/users/${id}`);
        if (res.status !== 200) throw new Error(`Failed to fetch profile. Status: ${res.status}`);
        setProfileUser(res.data);
        getUserReviews(id);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfileData();
    // eslint-disable-next-line
  }, [id]);

  const isOwnProfile = user && profileUser && user._id === profileUser._id;

  if (authLoading || reviewLoading || bookLoading || (!profileUser && !error)) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;
  if (!profileUser) return <Alert type="danger" message="User not found" />;

  return (
    <div className="profile-page">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body text-center">
              {profileUser.avatar ? (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="rounded-circle img-fluid mx-auto d-block"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: "120px", height: "120px", fontSize: "2.5rem" }}
                >
                  {profileUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h5 className="card-title mt-3">{profileUser.name}</h5>
              <p style={{ color: "var(--text-muted-color)" }}>
                Member since {new Date(profileUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="card-footer">
              <div className="d-flex justify-content-around text-center">
                <div>
                  <h6 className="mb-0">{userReviews.length}</h6>
                  <small style={{ color: "var(--text-muted-color)" }}>Reviews</small>
                </div>
                <div>
                  <h6 className="mb-0">{profileUser.readingList?.length || 0}</h6>
                  <small style={{ color: "var(--text-muted-color)" }}>Reading List</small>
                </div>
                <div>
                  <h6 className="mb-0">{profileUser.booksRead || 0}</h6>
                  <small style={{ color: "var(--text-muted-color)" }}>Books Read</small>
                </div>
              </div>
            </div>
          </div>

          {profileUser.bio && !isEditing && (
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="card-title">About</h6>
                <p style={{ color: "var(--text-color)" }}>{profileUser.bio}</p>
              </div>
            </div>
          )}

          {isOwnProfile && !isEditing && (
            <button
              className="btn btn-outline-primary w-100 mt-3"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit me-2"></i> Edit Profile
            </button>
          )}
          {isOwnProfile && !isAddBook && (
            <button
              className="btn btn-outline-primary w-100 mt-3"
              onClick={() => setIsAddBook(true)}
            >
              <i className="fas fa-book-medical me-2"></i> Add Book
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="col-md-9">
          {(isEditing || isAddBook) ? (
            <>
              {isEditing && (
                <div className="card">
                  <div className="card-header">
                    <h5>Edit Profile</h5>
                  </div>
                  <div className="card-body">
                    <ProfileEditForm
                      user={profileUser}
                      onCancel={() => setIsEditing(false)}
                      onSuccess={() => setIsEditing(false)}
                    />
                  </div>
                </div>
              )}
              {isAddBook && (
                <div className="card mt-3">
                  <div className="card-header">
                    <h5>Add Book</h5>
                  </div>
                  <div className="card-body">
                    <AddBook />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                {["reviews", "reading-list", "books-read"].map((tab) => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link ${activeTab === tab ? "active" : ""}`}
                      style={{
                        color: activeTab === tab ? "#fff" : "var(--text-color)",
                        backgroundColor: activeTab === tab ? "var(--primary-color)" : "transparent",
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "reviews" ? "Reviews" : tab === "reading-list" ? "Reading List" : "Books Read"}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="tab-content">
                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="review-tab">
                    <h2 className="h4 mb-4">Reviews</h2>
                    {userReviews.length > 0 ? (
                      <div className="review-list">
                        {userReviews.map((review) => (
                          <ReviewCard key={review?._id} review={review} showBook={true} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-book fa-3x text-muted mb-3" style={{ color: "var(--text-muted-color)" }}></i>
                        <h3>No reviews yet</h3>
                        <p style={{ color: "var(--text-muted-color)" }}>
                          {isOwnProfile
                            ? "You haven't written any reviews yet."
                            : `${profileUser.name} hasn't written any reviews yet.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reading List Tab */}
                {activeTab === "reading-list" && (
                  <div className="reading-list-tab">
                    <h2 className="h4 mb-4">Reading List</h2>
                    {profileUser.readingList?.length > 0 ? (
                      <div className="row">
                        {profileUser.readingList.map((book,index) => (
                          <div key={index} className="col-md-4 col-sm-6 mb-4">
                            <BookCard book={book} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-book fa-3x text-muted mb-3" style={{ color: "var(--text-muted-color)" }}></i>
                        <h3>Reading list is empty</h3>
                        <p style={{ color: "var(--text-muted-color)" }}>
                          {isOwnProfile
                            ? "You haven't added any books to your reading list yet."
                            : `${profileUser.name} hasn't added any books to their reading list yet.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Books Read Tab */}
                {activeTab === "books-read" && (
                  <div className="books-read-tab">
                    <h2 className="h4 mb-4">Books Read</h2>
                    {profileUser.booksRead > 0 && profileUser.readBooks?.length > 0 ? (
                      <div className="row">
                        {profileUser.readBooks.map((book) => (
                          <div key={book?._id} className="col-md-4 col-sm-6 mb-4">
                            <BookCard book={book} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-book fa-3x text-muted mb-3" style={{ color: "var(--text-muted-color)" }}></i>
                        <h3>No books read yet</h3>
                        <p style={{ color: "var(--text-muted-color)" }}>
                          {isOwnProfile
                            ? "You haven't marked any books as read yet."
                            : `${profileUser.name} hasn't marked any books as read yet.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
