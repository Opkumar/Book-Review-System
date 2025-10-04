# 📚 Book Review Platform

A full-stack web application where users can explore, review, and rate books. Admins can manage book entries, while users can browse, comment, and interact with the community.

---

## 🚀 Features

## 🔹 Functional Requirements

### 🧑‍💻 1. User Authentication
- Users can **sign up** with:
  - Name  
  - Unique Email  
  - Password (hashed using bcrypt)
- **Login** with email and password  
- **JWT token** returned on successful login  
- Protected routes using **middleware** for authenticated users  

### 📖 2. Book Management
- Add books with the following fields:
  - Title, Author, Description, Genre, Published Year
- Only the **creator of a book** can edit or delete it  
- All users can view the list of books  
- **Pagination** implemented (6 books per page)  

### ⭐ 3. Review System
- Users can:
  - Add reviews: Rating (1–5 stars) & Review Text  
  - Edit or delete their own reviews  
- Show:
  - All reviews for each book  
  - **Average rating** on the book details page  

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
| PUT    | `/api/users/:id`      | Update user profile (protected) |

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
| PUT    | `/api/reviews/:id`           | Edit a review (owner only)      |


## 🧾 Installation & Setup


1. Install dependencies:

### 📦 Prerequisites
- Node.js
- MongoDB
- npm 

### 🔗 Website Link
Visit the live application: [Book Review Platform](https://book-review-system-two.vercel.app)
