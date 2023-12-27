import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login/Login";
import { AuthContextProvider } from "./context/AuthContext";
import GenerateQR from "./components/GenerateQr.jsx";
import ScanQR from "./components/ScanAttendance.jsx";
import React from "react";
import ScheduleTable from "./pages/Calendar/Calendar.jsx";

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/generate-qr" element={<GenerateQR/>} />
          <Route path="/scan-qr" element={<ScanQR/>} />
          <Route path="/employee-calendar" element={<ScheduleTable />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
