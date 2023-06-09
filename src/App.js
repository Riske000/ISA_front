import React, { useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import "./css/logOutButton.css";
import "./css/form.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePageRegisteredUser from "./components/HomePageRegisteredUser";
import HomePageAdmin from "./components/HomePageAdmin";
import MyCalendar from "./components/Calendar";
import TermForm from "./components/TermForm";
import AdminsCenterDetails from "./components/AdminsCenterDetails";
import HomePageAdminCenter from "./components/HomePageAdminCenter";
import MyProfile from "./components/MyProfile";
import NewTerm from "./components/NewTerm";
import Questionnaire from "./components/Questionnaire";
import AllCenters from "./components/AllCenters";
import ChangePassword from "./components/ChangePassword";
import ProtectedRoute from "./auth/AuthGuard";

function App() {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState(null);

  return (
    <Routes>
      <Route index path="/" element={<AllCenters />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registration" element={<RegistrationForm />} />

      <Route
        element={
          <ProtectedRoute
            isAllowed={loggedUser !== null}
            redirectPath="/"
          >
            <Route path="/homePageRegisteredUser" element={<HomePageRegisteredUser />} />
            <Route path="/homePageAdmin" element={<HomePageAdmin />} />
            <Route path="/calendar" element={<MyCalendar />} />
            <Route path="/addTerm" element={<TermForm />} />
            <Route path="/homePageAdminCenter" element={<HomePageAdminCenter />} />
            <Route path="/adminsCenter" element={<AdminsCenterDetails />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/newTerm" element={<NewTerm />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/changePassword" element={<ChangePassword />} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
