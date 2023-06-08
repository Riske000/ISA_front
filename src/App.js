import React from "react";
import { useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import "./css/logOutButton.css";
import "./css/form.css";
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import HomePageRegisteredUser from "./components/HomePageRegisteredUser";
import HomePageAdmin from "./components/HomePageAdmin";
import MyCalendar from "./components/Calendar";
import TermForm from "./components/TermForm";
import AdminsCenterDetails from "./components/AdminsCenterDetails";
import HomePageAdminCenter from "./components/HomePageAdminCenter";
import MyProfile from "./components/MyProfile";
import NewTerm from "./components/NewTerm";
import ChangePassword from "./components/ChangePassword";



function App() {
  const navigate = useNavigate();
  const [loggedUser, setLogedUserType] = useState(null);
  

  return (
      <Routes >
        <Route index path="/" element={<LoginForm />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/homePageRegisteredUser" element={<HomePageRegisteredUser />} />
        <Route path="/homePageAdmin" element={<HomePageAdmin />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/addTerm" element={<TermForm />} />
        <Route path="/homePageAdminCenter" element={<HomePageAdminCenter />} />
        <Route path="/adminsCenter" element={<AdminsCenterDetails />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/newTerm" element={<NewTerm />} />
        <Route path="/changePassword" element={<ChangePassword />} />
      </Routes>
  );
}

export default App;

/*<div>
    <div className="App">
      {appState === "login" && (
        <LoginForm appState={setAppState} userType={setLogedUserType} />
      )}
      {appState === "register" && <RegistrationForm appState={setAppState} />}
    </div>
    {appState !== "login" && appState !== "register" && (
      <div className="div-right_bottom ">
        <button className="button-right_bottom" onClick={onLogOutClick}>
          Log out
        </button>
      </div>
    )}
  </div>*/
