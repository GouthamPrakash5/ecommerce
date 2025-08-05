# RainbowShop Backend API

This is the backend API for the RainbowShop ecommerce application, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- JWT-based token system
- User role management (admin/user)
- User blocking/unblocking functionality
- Purchase history tracking
- Admin user management
- MongoDB integration with Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create a `.env` file):
```env
MONGODB_URI=mongodb://localhost:27017/rainbowshop
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

3. Initialize the database with sample data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Public Routes (No Authentication Required)

**POST** `/api/auth/register`
- Register a new user
- Body: `{ "name": "string", "email": "string", "password": "string" }`
- Returns: User data and JWT token

**POST** `/api/auth/login`
- Login user
- Body: `{ "email": "string", "password": "string" }`
- Returns: User data and JWT token

#### Protected Routes (Authentication Required)

**GET** `/api/auth/profile`
- Get current user profile
- Headers: `Authorization: Bearer <token>`
- Returns: User profile data

**PUT** `/api/auth/profile`
- Update user profile
- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": "string", "email": "string" }`
- Returns: Updated user profile

**PUT** `/api/auth/change-password`
- Change user password
- Headers: `Authorization: Bearer <token>`
- Body: `{ "currentPassword": "string", "newPassword": "string" }`
- Returns: Success message

**GET** `/api/auth/purchase-history`
- Get user's purchase history
- Headers: `Authorization: Bearer <token>`
- Returns: Array of purchase orders

#### Admin Routes (Authentication + Admin Role Required)

**GET** `/api/auth/users`
- Get all users (with pagination)
- Headers: `Authorization: Bearer <token>`
- Query params: `page` (default: 1), `limit` (default: 10)
- Returns: Users array and pagination info

**GET** `/api/auth/users/:userId`
- Get specific user by ID
- Headers: `Authorization: Bearer <token>`
- Returns: User data

**PUT** `/api/auth/users/:userId/block`
- Block or unblock a user
- Headers: `Authorization: Bearer <token>`
- Body: `{ "isBlocked": boolean }`
- Returns: Updated user data

**PUT** `/api/auth/users/:userId/role`
- Change user role
- Headers: `Authorization: Bearer <token>`
- Body: `{ "role": "user" | "admin" }`
- Returns: Updated user data

**DELETE** `/api/auth/users/:userId`
- Delete a user
- Headers: `Authorization: Bearer <token>`
- Returns: Success message

## Sample Users

After running the seed script, the following users will be available:

### Admin Account
- Email: `admin@rainbowshop.com`
- Password: `admin123`
- Role: `admin`

### User Accounts
- Email: `john@example.com`
- Password: `user123`
- Role: `user`

- Email: `jane@example.com`
- Password: `user123`
- Role: `user`

## Database Schema

### User Model
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isBlocked: Boolean (default: false),
  purchaseHistory: Array of orders,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Purchase History Schema
```javascript
{
  orderId: String (required),
  products: Array of {
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  },
  totalAmount: Number (required),
  orderDate: Date (default: now),
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
}
```

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Role-based access control
- User blocking functionality
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## Error Handling

All API endpoints return consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Development

- Use `npm run dev` for development with auto-restart
- Use `npm start` for production
- Use `npm run seed` to reset database with sample data

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL for CORS
- `NODE_ENV`: Environment (development/production)

## API Response Format

All successful responses follow this format:

```javascript
{
  "success": true,
  "message": "Optional message",
  "data": {
    // Response data
  }
}
``` 