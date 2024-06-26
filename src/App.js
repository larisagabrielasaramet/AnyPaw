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
import AdoptionDetails from "./pages/Adoption/AdoptionDetails";
import DoctorPage from "./Components/Doctor/Homepage/DoctorPage";
import DoctorNavbar from "./Components/Doctor/Homepage/NavBarDoc";
import DoctorProfile from "./Components/Doctor/DoctorProfile/DoctorProfile";
import AppointmentPage from "./Components/Doctor/Appointments/AppointmentPage";
import PacientPage from "./Components/Doctor/Pacients/PacientPage";
import PacientProfile from "./Components/Pacient/PacientProfile";
import PacientAppointments from "./Components/Pacient/PacientAppointments";
import MedicalHistoryPage from "./Components/Doctor/Pacients/MedicalHistoryPage";
import MedicalHistoryPatientPage from "./Components/Pacient/MedicalHistoryPatientPage";
import AdoptionForm from "./pages/Adoption/AdoptionForm";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientNavbar from "./Components/Pacient/PatientNavBar";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/team"
            element={
              <>
                <Navbar />
                <Teams />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <Navbar />
                <Services />
              </>
            }
          />
          <Route
            path="/review"
            element={
              <>
                <Navbar />
                <Review />
              </>
            }
          />
          <Route
            path="/adoption"
            element={
              <>
                <Navbar />
                <Adoption />
              </>
            }
          />
          <Route
            path="/info"
            element={
              <>
                <Navbar />
                <Info />
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Navbar />
                <SignUp />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/services/:title"
            element={
              <>
                <Navbar />
                <ServiceDetails />
              </>
            }
          />
          <Route
            path="/adoptions/:title"
            element={
              <>
                <Navbar />
                <AdoptionDetails />
              </>
            }
          />
          <Route
            path="/doctor"
            element={
              <>
                <DoctorNavbar />
                <DoctorPage />
              </>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <>
                <DoctorNavbar />
                <DoctorProfile />
              </>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <>
                <DoctorNavbar />
                <AppointmentPage />
              </>
            }
          />

          <Route
            path="/doctor/patients"
            element={
              <>
                <DoctorNavbar />
                <PacientPage />
              </>
            }
          />

          <Route
            path="/doctor/patients/:petId"
            element={
              <>
                <DoctorNavbar />
                <MedicalHistoryPage />
              </>
            }
          />
          <Route
            path="/patient"
            element={
              <>
                <PatientNavbar />
                <Home />
              </>
            }
          />
          <Route
            path="/patient/team"
            element={
              <>
                <PatientNavbar />
                <Teams />
              </>
            }
          />
          <Route
            path="/patient/services"
            element={
              <>
                <PatientNavbar />
                <Services />
              </>
            }
          />
          <Route
            path="/patient/services/:title"
            element={
              <>
                <PatientNavbar />
                <ServiceDetails />
              </>
            }
          />

          <Route
            path="/patient/review"
            element={
              <>
                <PatientNavbar />
                <Review />
              </>
            }
          />
          <Route
            path="/patient/adoption"
            element={
              <>
                <PatientNavbar />
                <Adoption />
              </>
            }
          />
          <Route
            path="/patient/info"
            element={
              <>
                <PatientNavbar />
                <Info />
              </>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <>
                <PatientNavbar />
                <PacientAppointments />
              </>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <>
                <PatientNavbar />
                <PacientProfile />
              </>
            }
          />
          <Route
            path="/patient/profile/:petId"
            element={
              <>
                <PatientNavbar />
                <MedicalHistoryPatientPage />
              </>
            }
          />

          {/* <Route
            path="/profile/:petId"
            element={
              <>
                <PatientNavbar />
                <MedicalHistoryPatientPage />
              </>
            }
          /> */}

          <Route path="/form" element={<AdoptionForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
