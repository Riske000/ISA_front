import React from "react";
import { useState, useEffect } from "react";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import "../css/tab.css";
import { useNavigate } from "react-router-dom";
import AllCenters from "./AllCenters";
import ReservedTerms from "./ReservedTerms";
import MyProfile from "./MyProfile";
import Questionnaire from "./Questionnaire";
import MyPenalties from "./MyPenalties";
import WriteAComplaint from "./WriteAComplaint";
import HistoryOfVisits from "./HistoryOfVisits";
import QRcodes from "./QRcodes";
import Calendar from "./Calendar";
import TermForm from "./TermForm";
import AdminsCenterDetails from "./AdminsCenterDetails";

const token = localStorage.getItem("token");

const HomePageAdminCenter = (props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All centers");

  const onLogOutClick = (event) => {
    localStorage.clear();
    navigate("/");
  };

  function toProfile() {
    setActiveTab("My profile");
  }
  return (
    <div>
      <div className="tab-bar">
        
        
        <div
          className={`tab ${activeTab === "My profile" ? "active" : ""}`}
          onClick={() => setActiveTab("My profile")}
        >
          My profile
        </div>
        <div
          className={`tab ${activeTab === "My Medical Center" ? "active" : ""}`}
          onClick={() => setActiveTab("My Medical Center")}
        >
          My Medical Center
        </div>
        <div
          className={`tab ${activeTab === "Work Calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("Work Calendar")}
        >
          Work Calendar
        </div>
        <div
          className={`tab ${activeTab === "Add Term" ? "active" : ""}`}
          onClick={() => setActiveTab("Add Term")}
        >
          Add Term
        </div>
      </div>
      <div>
            {activeTab === "My profile" && <MyProfile/>}

            {activeTab === "My Medical Center" && <AdminsCenterDetails/>}

            {activeTab === "Work Calendar" && <Calendar/>}

            {activeTab === "Add Term" && <TermForm/>}
      </div>
      <button className="button-right_bottom" onClick={onLogOutClick}>
        Log out
      </button>
    </div>
  );
};

export default HomePageAdminCenter;
