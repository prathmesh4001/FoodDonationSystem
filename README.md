# 🍲 Food Donation System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![ExpressJS](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> A modern, full-stack digital platform designed to bridge the gap between food donors (restaurants, hotels, events, individuals) and organizations/volunteers in need. By optimizing distribution logistics and listing real-time availability, this platform aims to drastically reduce food waste and support vulnerable communities.

---

## ✨ Features & Capabilities

### 👤 Donor Portal
* **Intuitive Statistics**: Monitor key donation metrics (total, active, claimed, and delivered donations) directly from a sleek analytics dashboard.
* **Instant Listing Creation**: Post new food items in seconds with image uploads, item details, quantities, and expiration indicators.
* **Interactive Timeline**: Track live statuses of all donated items as they move from *Available* to *Claimed* and *Delivered*.

### 🛡️ Secure Platform Infrastructure
* **JSON Web Token (JWT) Auth**: End-to-end security via state-based cookies (`cookie-parser`) and token authentication.
* **Granular Validation**: Frontend validation powered by **Zod** schema structures coupled with **React Hook Form** for zero-latency user experience.
* **Server Shielding**: Embedded security layers utilizing **Helmet** headers, **bcryptjs** password hashing, and **Express Rate Limiting** to prevent API abuse.

---

## 🛠️ Architecture & Tech Stack

| Frontend Layer | Backend Core | Database & File System |
| :--- | :--- | :--- |
| **React 19 & Vite** (Core framework) | **Node.js & Express.js** (REST API) | **MongoDB & Mongoose** (ODM) |
| **Tailwind CSS v4** (Utility styling) | **JSON Web Tokens (JWT)** (Session Auth) | **Multer Storage** (Food asset uploads) |
| **Framer Motion** (Micro-animations) | **bcryptjs** (Encryption engine) | |
| **Recharts** (Interactive data visualization) | **Helmet & Express Rate Limit** (Security) | |

---

## 📂 Repository Architecture

```text
FoodDonationSystem/
├── client/                     # Frontend client build context
│   ├── src/
│   │   ├── components/         # Global layout, feedback & UI elements
│   │   ├── pages/              # Admin pages, Authentication & Dashboard layouts
│   │   ├── services/           # Axios HTTP client instances
│   │   └── App.jsx             # Main application router
│   ├── package.json            # Client dependencies and build tasks
│   └── vite.config.js          # Vite and Tailwind config
├── server/                     # Backend server build context
│   ├── config/                 # Database connector files
│   ├── controllers/            # Request handlers (auth, donation, dashboard)
│   ├── models/                 # Mongoose schemas (User, Donation)
│   ├── routes/                 # Express API endpoints
│   ├── uploads/                # Disk storage folder for uploaded food images
│   └── server.js               # Application entry point
├── .gitignore                  # Git exclude list
└── README.md                   # Repository documentation
```

---

## 🚀 Setup & Launch Protocol

<details>
<summary>📋 Prerequisites</summary>

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (Version 18 or above recommended)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Or a MongoDB Atlas URI)
</details>

<details>
<summary>⚙️ Backend Installation & Setup</summary>

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure your local environment by creating a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/foodDonation
   JWT_SECRET=your_super_secret_jwt_signature_key
   ```
4. Start the Express development server (using Nodemon):
   ```bash
   npm run dev
   ```
</details>

<details>
<summary>💻 Frontend Installation & Setup</summary>

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` (or the port specified in your Vite output).
</details>

---

## 🔮 Future Enhancements

* **📍 Real-Time Route Optimization**: Integrate Google Maps API to offer real-time tracking and optimal routing for volunteers delivering food items.
* **🔔 Smart Notification System**: Set up in-app and email alerts (via WebSockets/Nodemailer) to instantly notify nearby volunteers/NGOs when a new donation is posted.
* **🤝 Volunteer Network Integration**: Create dedicated volunteer accounts to let users claim, transport, and verify food deliveries.
* **📊 Carbon Footprint Savings Tracker**: Show metric impact dashboards representing estimated carbon/water footprints saved by preventing food waste.
* **🏆 Gamification & Impact Leaderboard**: Reward top donors and active volunteers with karma badges and public highlights to boost community engagement.

---

## 🤝 Community & Support

* **Issues**: Found a bug or have a suggestion? Open an issue in our [GitHub Issues](https://github.com/prathmesh4001/FoodDonationSystem/issues) tab.
* **Contributions**: Pull requests are welcome. Please ensure that all changes adhere to standard linting rules before submitting.

---

## 📄 License
This project is licensed under the **ISC License**.
