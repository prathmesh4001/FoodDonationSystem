# Food Donation System

A modern, full-stack web application designed to connect food donors with organizations, volunteers, or people in need to reduce food waste and support communities.

---

## 🚀 Key Features

* **Donor Dashboard**: Access overview statistics, track active/delivered donations, and manage new listings.
* **Interactive Data Visualization**: Real-time charts demonstrating donation trends and distributions using Recharts.
* **Authentication & Authorization**: Secure user registration, login, and password management with JWT tokens.
* **Image Uploads**: Dynamic food listing image uploads managed via Multer.
* **Responsive Modern UI**: Styled with Tailwind CSS, animated with Framer Motion, and built on React 19 with Vite.
* **Security & Performance**: Enhanced server protection using Helmet, Express Rate Limiter, and bcryptjs passwords.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19, Vite
* **Styling**: Tailwind CSS (v4)
* **Routing**: React Router DOM (v7)
* **State & Forms**: React Hook Form, Zod (validation)
* **Animation & Icons**: Framer Motion, React Icons
* **Charts**: Recharts
* **API Client**: Axios

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT), bcryptjs
* **Upload Handler**: Multer

---

## 📂 Project Structure

```text
FoodDonationSystem/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components (common, feedback)
│   │   ├── pages/          # Page layouts (admin, auth, public)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js API
│   ├── config/             # DB & Config parameters
│   ├── controllers/        # Business logic controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API endpoints
│   ├── uploads/            # Uploaded food images
│   ├── package.json
│   └── server.js
└── .gitignore
```

---

## 💻 Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/prathmesh4001/FoodDonationSystem/issues) if you want to contribute.

## 📄 License
This project is licensed under the ISC License.
