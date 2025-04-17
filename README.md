# 📚 Book Review Platform

A full-stack web application where users can explore, review, and rate books. Admins can manage book entries, while users can browse, comment, and interact with the community.

---

## 🚀 Features

### 🧑‍💻 User
- Sign up and log in using JWT authentication
- Browse books with cover images and metadata
- View book details and reviews
- Submit and delete your own reviews
- Rate books with a star rating system

### 🛡️ Admin
- Add new books with cover image URL and description
- Edit and delete existing books
- View and manage all reviews

---

## 🛠️ Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React, Axios, React Bootstrap / Tailwind CSS |
| Backend     | Node.js, Express  |
| Database    | MongoDB with Mongoose |
| Auth        | JSON Web Token (JWT) |

---
## 🌐 Backend Routes

### User Routes
| Method | Endpoint             | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/api/users/register` | Register a new user             |
| POST   | `/api/users/login`    | Log in and get a JWT token      |
| GET    | `/api/users/profile`  | Get user profile (protected)    |

### Book Routes
| Method | Endpoint             | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/books`          | Get all books                   |
| GET    | `/api/books/:id`      | Get details of a specific book  |
| POST   | `/api/books`          | Add a new book (admin only)     |
| PUT    | `/api/books/:id`      | Update a book (admin only)      |
| DELETE | `/api/books/:id`      | Delete a book (admin only)      |

### Review Routes
| Method | Endpoint                     | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/api/reviews`               | Add a review for a book         |
| DELETE | `/api/reviews/:id`           | Delete a review (owner only)    |

## 🧾 Installation & Setup


1. Install dependencies:

### 📦 Prerequisites
- Node.js
- MongoDB
- npm 

### 🔗 Website Link
Visit the live application: [Book Review Platform](https://book-review-system-two.vercel.app)
