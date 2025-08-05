# RainbowShop - Ecommerce Application

A modern, responsive ecommerce application built with React, featuring both user and admin functionalities with a beautiful rainbow-themed design.

## Features

### User Features
- **Product Browsing**: View all products with search and filtering capabilities
- **Product Details**: Detailed product pages with stock information
- **Shopping Cart**: Add, remove, and update quantities in cart
- **User Authentication**: Login and registration system
- **Purchase History**: View past orders and order details
- **User Profile**: Manage account information

### Admin Features
- **Dashboard**: Overview of store statistics and recent activity
- **Product Management**: Add, edit, delete products with stock tracking
- **User Management**: View user details, manage roles, and block users
- **Order Management**: View and manage customer orders
- **Inventory Tracking**: Monitor stock levels with low stock alerts

## Design Features
- **Rainbow Theme**: Beautiful gradient colors throughout the application
- **Minimalistic UI**: Clean, modern design with white backgrounds
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions for better UX

## Demo Accounts

### Admin Account
- Email: `admin@rainbowshop.com`
- Password: `admin123`

### User Account
- Email: `john@example.com`
- Password: `user123`

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.jsx      # Navigation component
├── contexts/           # React context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── ProductContext.jsx # Product data management
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Product listing
│   ├── ProductDetail.jsx # Individual product page
│   ├── Cart.jsx        # Shopping cart
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── UserProfile.jsx # User profile management
│   ├── PurchaseHistory.jsx # Order history
│   └── admin/          # Admin pages
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminUsers.jsx
│       └── AdminOrders.jsx
└── App.jsx             # Main application component
```

## Technologies Used

- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons
- **CSS Variables**: Custom properties for theming
- **LocalStorage**: Data persistence for demo purposes

## Key Features Implementation

### State Management
- Uses React Context for global state management
- Separate contexts for authentication, cart, and products
- Local storage for data persistence

### Responsive Design
- CSS Grid and Flexbox for layouts
- Mobile-first approach
- Breakpoints for different screen sizes

### User Experience
- Loading states and error handling
- Form validation
- Smooth transitions and animations
- Intuitive navigation

## Future Enhancements

- Backend API integration
- Payment processing
- Real-time inventory updates
- Advanced search and filtering
- User reviews and ratings
- Email notifications
- Admin analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
