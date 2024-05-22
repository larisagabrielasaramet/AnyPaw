import Home from "./pages/Home/index";
import Navbar from "./Components/Navbar/Navbar";
import Services from "./pages/Services/Services";
import Review from "./pages/Review/Review";
import Teams from "./pages/Team/Team";
import Adoption from "./pages/Adoption/Adoption";
import SignUp from "./pages/Singup";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Info from "./pages/Info/Info";
import React from "react";
import ServiceDetails from "./pages/Services/ServiceDetails";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Teams />} />
          <Route path="/services" element={<Services />} />
          <Route path="/review" element={<Review />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/info" element={<Info />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services/:title" element={<ServiceDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
