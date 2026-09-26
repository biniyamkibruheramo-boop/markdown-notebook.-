# Markdown Notes App

A full-stack, cloud-authenticated Markdown note-taking web application built with **React**, **Node.js / Express**, **MongoDB**, and **Firebase Authentication**.

---

## ✨ Features

- **🔐 Secure Authentication**: Firebase Authentication supporting Email/Password and one-click Google Sign-In.
- **📝 Real-time Markdown Editor**: Split-screen editing with an instant live Markdown preview rendered via Marked.
- **🛠️ Markdown Formatting Toolbar**: Quick-insert buttons for headings, bold, italics, blockquotes, code blocks, bullet/numbered lists, and links.
- **🔍 Instant Search**: Real-time debounce/keyword search across note titles and body content.
- **👤 User Isolation**: Notes are strictly scoped to the authenticated user's Firebase UID and verified on the server via Firebase Admin SDK.
- **⚡ Fast & Modern**: Built with Vite and React 18 on the frontend and Express + Mongoose on the backend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Parsing**: [Marked](https://marked.js.org/)
- **Auth Client**: [Firebase Web SDK v12](https://firebase.google.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- **Auth Verification**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **CORS & Environment**: `cors`, `dotenv`, `nodemon`

---

## 📁 Project Structure

```text
my-project 2nd/
├── backend/
│   ├── src/
│   │   ├── config/             # DB & Firebase Admin configurations
│   │   │   ├── db.js
│   │   │   └── firebaseAdmin.js
│   │   ├── controllers/        # Note business logic & handlers
│   │   │   └── noteController.js
│   │   ├── middleware/         # Auth & error-handling middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/             # Mongoose schemas
│   │   │   └── Note.js
│   │   ├── routes/             # Express API routes
│   │   │   └── noteRoutes.js
│   │   └── server.js           # Server entry point & CORS configuration
│   ├── .env.example            # Backend env template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React UI components (Editor, Toolbar, Preview, etc.)
│   │   ├── config/             # Firebase client configuration
│   │   ├── context/            # AuthContext provider
│   │   ├── pages/              # Main view pages (NotesPage)
│   │   ├── services/           # API communication layer (noteService)
│   │   ├── App.jsx             # Root application component
│   │   └── main.jsx            # Frontend entry point
│   ├── .env.example            # Frontend env template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore                  # Root Git ignore rules
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URL.
- A **Firebase Project** with Authentication enabled (Google & Email/Password).

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment configuration file:
   ```bash
   Copy-Item .env.example .env
   ```

4. Edit `backend/.env` with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/markdown_notes
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

---

### 2. Frontend Setup

1. In a new terminal, navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment configuration file:
   ```bash
   Copy-Item .env.example .env
   ```

4. Edit `frontend/.env` with your Firebase web configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5000/api/notes
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📡 API Endpoints

All note endpoints require an `Authorization: Bearer <Firebase_ID_Token>` header.

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health check | No |
| `GET` | `/api/notes` | Get all notes for the authenticated user | Yes |
| `GET` | `/api/notes?search=:query` | Search user notes by title or content | Yes |
| `GET` | `/api/notes/:id` | Get single note by ID | Yes |
| `POST` | `/api/notes` | Create a new note (`{ title, content }`) | Yes |
| `PUT` | `/api/notes/:id` | Update note by ID (`{ title, content }`) | Yes |
| `DELETE` | `/api/notes/:id` | Delete note by ID | Yes |

---

## 📜 Available Scripts

### Backend (`backend/`)
- `npm run dev` - Starts server with `nodemon` for auto-reloading during development.
- `npm start` - Starts server with standard `node`.

### Frontend (`frontend/`)
- `npm run dev` - Starts Vite dev server with Hot Module Replacement (HMR).
- `npm run build` - Builds production-optimized bundle in `dist/`.
- `npm run preview` - Previews production build locally.

---

## 🔒 Security Best Practices

- **Never commit `.env` files**: All `.env` and credential files are ignored via `.gitignore`.
- **Token Verification**: Every backend request is verified against Firebase Auth servers to prevent unauthorized data access.
- **Data Isolation**: Database queries automatically filter on the authenticated user's `userId`.
