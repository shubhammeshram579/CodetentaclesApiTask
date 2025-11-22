# 🚀 E-Commerce Platform Backend (Admin + Seller System)

This project is a backend assignment built using **Node.js, Express, MongoDB, JWT Authentication, Multer, and Cloudinary**.  
It implements a role-based system where **Admins manage Sellers**, and **Sellers manage Products** with multiple brands and uploaded images.

This assignment was developed for the **CodeTentacles Technologies Node.js Task**.

---

## 📘 Project Description

This backend provides two main user roles: **Admin** and **Seller**.

### 🔐 Admin Can:
- Login
- Create Sellers (with full validation)
- List Sellers (with pagination)

### 🧑‍💼 Seller Can:
- Login
- Add Products  
- Upload multiple *brand images* using **Multer + Cloudinary**
- List their own products (pagination supported)
- Delete their own products

The system uses proper:
- HTTP status codes  
- Error handling  
- Form validation  
- Secure password hashing (bcrypt)  
- JWT-based role authorization

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Multer (memory storage)**
- **Cloudinary (Image Uploads)**
- **JWT Authentication**
- **Express Validator**
- **Bcrypt Password Hashing**

---

---

## 📡 API Endpoints

### 🔐 **Admin APIs**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/admin/login` | Admin Login → Returns JWT Token |
| **POST** | `/api/admin/sellers` | Create Seller (Admin-only) |
| **GET** | `/api/admin/sellers?page=1&limit=10` | List Sellers (Pagination) |

---

### 🧑‍💼 **Seller APIs**

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/seller/login` | Seller Login → Returns JWT Token |
| **POST** | `/api/seller/products` | Add Product (Multiple brands + image upload) |
| **GET** | `/api/seller/products?page=1&limit=10` | Get Seller Products (Pagination) |
| **DELETE** | `/api/seller/products/:productId` | Delete Own Product |

---

## 🖼️ Add Product (File Upload API)

### URL:
- http://localhost:4000

## Api Run commnet
- npm run start
- npm run creatAdm

🧪 Testing with Postman

1️⃣ Import the Postman collection
2️⃣ Login as Admin
3️⃣ Create a Seller
4️⃣ Login as Seller
5️⃣ Add Product using form-data
6️⃣ List Products
7️⃣ Delete Product
