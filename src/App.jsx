import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Recommend from "./Recommend";
import Wardrobe from "./Wardrobe";
import Styles from "./Styles";
import Saved from "./Saved";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Recommend />
            </PrivateRoute>
          }
        />
        <Route
          path="/wardrobe"
          element={
            <PrivateRoute>
              <Wardrobe />
            </PrivateRoute>
          }
        />
        <Route
          path="/styles"
          element={
            <PrivateRoute>
              <Styles />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <Saved />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}