import React, { useState, useEffect } from "react";
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
import Analytics from "./Analytics";

const token = localStorage.getItem("token");


const HomePageAdminCenter = (props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All centers");
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(
    String(localStorage.getItem("isFirstLogin")) === "true"
  );
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onLogOutClick = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeChangePasswordDialog = () => {
    setShowChangePasswordDialog(false);
  };

  const handleChangePassword = async () => {
    try {
      const passwordData = {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      };
  
      const response = await fetch("http://localhost:8080/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token, 
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        localStorage.setItem("isFirstLogin", "false");
        window.location.reload();
      } else if (response.status === 401) {
      } else {
      }
    } catch (error) {
    }
  };

  const toProfile = () => {
    setActiveTab("My profile");
  };

  return (
    <div>
      {showChangePasswordDialog && (
        <div className="change-password-dialog">
          <h3>Change Password</h3>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Change Password</button>
          <button onClick={closeChangePasswordDialog}>Cancel</button>
        </div>
      )}

      {!showChangePasswordDialog && (
        <div>
          <div className="tab-bar">
            <div
              className={`tab ${activeTab === "My profile" ? "active" : ""}`}
              onClick={() => setActiveTab("My profile")}
            >
              My profile
            </div>
            <div
              className={`tab ${
                activeTab === "My Medical Center" ? "active" : ""
              }`}
              onClick={() => setActiveTab("My Medical Center")}
            >
              My Medical Center
            </div>
            <div
              className={`tab ${
                activeTab === "Work Calendar" ? "active" : ""
              }`}
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
            <div
              className={`tab ${activeTab === "Analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("Analytics")}
            >
              Analytics
            </div>
          </div>
          <div>
            {activeTab === "My profile" && <MyProfile />}
            {activeTab === "My Medical Center" && <AdminsCenterDetails />}
            {activeTab === "Work Calendar" && <Calendar />}
            {activeTab === "Add Term" && <TermForm />}
            {activeTab === "Analytics" && <Analytics />}
          </div>
          <button className="button-right_bottom" onClick={onLogOutClick}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePageAdminCenter;