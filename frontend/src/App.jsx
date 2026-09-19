import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import JourneyDetails from "./pages/JourneyPage";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* ===================================================
            PUBLIC
        =================================================== */}

        <Route path="/" element={<Home />} />
        
        <Route path="/home" element={<Home />} />

        <Route path="/blogs" element={<Blogs />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/post/:id" element={<PostDetails />} />

        {/* ===================================================
            PROTECTED
        =================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* ===================================================
            JOURNEY DETAILS
        =================================================== */}

        <Route
          path="/journeys/:id"
          element={
            <ProtectedRoute>
              <JourneyDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
