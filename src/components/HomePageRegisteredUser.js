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
import NewTerm from "./NewTerm";

const token = localStorage.getItem("token");

const HomePageRegisteredUser = (props) => {
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
          className={`tab ${activeTab === "All centers" ? "active" : ""}`}
          onClick={() => setActiveTab("All centers")}
        >
          All centers
        </div>
        <div
          className={`tab ${activeTab === "Reserve Term" ? "active" : ""}`}
          onClick={() => setActiveTab("Reserve Term")}
        >
          New Term
        </div>
        <div
          className={`tab ${activeTab === "History of visits" ? "active" : ""}`}
          onClick={() => setActiveTab("History of visits")}
        >
          History of visits
        </div>
        <div
          className={`tab ${activeTab === "Reserved terms" ? "active" : ""}`}
          onClick={() => setActiveTab("Reserved terms")}
        >
          Reserved terms
        </div>
        <div
          className={`tab ${activeTab === "List of QR codes" ? "active" : ""}`}
          onClick={() => setActiveTab("List of QR codes")}
        >
          List of QR codes
        </div>
        <div
          className={`tab ${activeTab === "My penalties" ? "active" : ""}`}
          onClick={() => setActiveTab("My penalties")}
        >
          My penalties
        </div>
        <div
          className={`tab ${activeTab === "Questionnaire" ? "active" : ""}`}
          onClick={() => setActiveTab("Questionnaire")}
        >
          Questionnaire
        </div>
        <div
          className={`tab ${activeTab === "Write an complaint" ? "active" : ""}`}
          onClick={() => setActiveTab("Write an complaint")}
        >
          Write a complaint
        </div>
        
        
      </div>
      <div>
            {activeTab === "My profile" && <MyProfile/>}

            {activeTab === "All centers" && <AllCenters/>}

            {activeTab === "Reserve Term" && <NewTerm/>}

            {activeTab === "History of visits" && <HistoryOfVisits/>}

            {activeTab === "Reserved terms" && <ReservedTerms/>}

            {activeTab === "List of QR codes" && <QRcodes/>}

            {activeTab === "My penalties" && <MyPenalties/>}

            {activeTab === "Questionnaire" && <Questionnaire toProfile={toProfile}/>}
            
            {activeTab === "Write an complaint" && <WriteAComplaint/>}

      </div>
      <button className="button-right_bottom" onClick={onLogOutClick}>
        Log out
      </button>
    </div>
  );
};

export default HomePageRegisteredUser;
