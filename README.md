# Mealplan Web Application

A modern web application for meal planning and management, built with React and Node.js.

## 🚀 Tech Stack

### Frontend
- React 18
- Material Tailwind
- Redux Toolkit
- React Query
- React Router DOM
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Prisma
- JWT Authentication
- AWS S3 for file storage
- Multer for file uploads

## ✨ Features

- User Authentication
- Meal Planning
- File Upload Support
- Responsive Dashboard
- Calendar Integration
- Data Visualization with ApexCharts
- Background Image Processing
- CSV Data Processing

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS S3 Account (for file storage)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_bucket_name
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
mealplan/
├── backend/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── uploads/        # File upload directory
│   └── index.js        # Main server file
├── frontend/
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── index.html     # Entry point
└── uploads/           # Shared upload directory
```

## 🔒 Environment Variables

Make sure to set up the following environment variables in your backend `.env` file:

- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_BUCKET_NAME`: S3 bucket name

## 📝 License

This project is licensed under the ISC License.
