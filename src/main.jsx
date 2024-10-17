import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/AuthPage";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Classic from "./options/Classic.jsx";
import ChnageUsername from "./optionsGear/ChnageUsername.jsx";
import ChangePassword from "./optionsGear/ChangePassword.jsx";
import Options from "./options/Options.jsx";
import Leaderboards from "./options/Leaderboards.jsx";
import VsFriend from "./pages/vsFriend.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Context from "./Context";
import "react-toastify/dist/ReactToastify.css";
import Challange from "./pages/Challange";
import { ToastContainer } from "react-toastify";
import Clans from "./pages/Clans.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <BrowserRouter>
      <Context>
        <Routes>
          <Route path="/auth" element={<App />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<Home />} />
            <Route path="/classic" element={<Classic />} />
            <Route path="/challenge" element={<Challange />} />
            <Route path="/clans" element={<Clans />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="options" element={<Options />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/change-username" element={<ChnageUsername />} />
            <Route
              path="/vsFriend/:player/:opponent/:gameId"
              element={<VsFriend />}
            />
          </Route>
        </Routes>
      </Context>
    </BrowserRouter>
  </>
);
