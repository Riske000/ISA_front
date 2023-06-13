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

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const HomePageAdminCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All centers");
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(
    String(localStorage.getItem("isFirstLogin")) === "true"
  );
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [visitedUsers, setVisitedUsers] = useState([]);
  const [pastTakenTerms, setPastTakenTerms] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSurname, setSearchSurname] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
        // Handle unauthorized error
      } else {
        // Handle other errors
      }
    } catch (error) {
      // Handle network or other errors
    }
  };

  useEffect(() => {
    const fetchPastTakenTerms = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/term/medical-center/${currentUser.medicalCenter.id}/past-taken-terms`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPastTakenTerms(data);
        } else {
          // Handle error
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchPastTakenTerms();
  }, [currentUser.medicalCenter.id]);

  const handleSearch = () => {
    const filteredResults = pastTakenTerms.filter((term) => {
      const nameMatch = term.user.name.toLowerCase().includes(searchName.toLowerCase());
      const surnameMatch = term.user.surname.toLowerCase().includes(searchSurname.toLowerCase());
      return nameMatch && surnameMatch;
    });

    setSearchResults(filteredResults);
  };

  const handleSort = () => {
    let sortedResults = [...searchResults];

    if (sortOption === "name") {
      sortedResults.sort((a, b) => a.user.name.localeCompare(b.user.name));
    } else if (sortOption === "surname") {
      sortedResults.sort((a, b) => a.user.surname.localeCompare(b.user.surname));
    } else if (sortOption === "date") {
      sortedResults.sort((a, b) => new Date(a.dateOfTerm) - new Date(b.dateOfTerm));
    }

    setSearchResults(sortedResults);
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
          </div>
          <div>
            {activeTab === "My profile" && <MyProfile />}
            {activeTab === "My Medical Center" && <AdminsCenterDetails />}
            {activeTab === "Work Calendar" && <Calendar />}
            {activeTab === "Add Term" && <TermForm />}

            {activeTab !== "My profile" && activeTab !== "My Medical Center" && activeTab !== "Work Calendar" && activeTab !== "Add Term" && (
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Search by surname"
                    value={searchSurname}
                    onChange={(e) => setSearchSurname(e.target.value)}
                  />
                  <button onClick={handleSearch}>Search</button>
                </div>
                <div>
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="surname">Surname</option>
                    <option value="date">Date</option>
                  </select>
                  <button onClick={handleSort}>Sort</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Name</th>
                      <th>Surname</th>
                    </tr>
                  </thead>
                  <tbody>
                  {searchResults.map((term) => (
  <tr key={term.id} onClick={() => navigate(`/termDetails/${term.id}`)}>
    <td>{new Date(term.dateOfTerm).toLocaleDateString()}</td>
    <td>{new Date(term.dateOfTerm).toLocaleTimeString()}</td>
    <td>{term.user.name}</td>
    <td>{term.user.surname}</td>
  </tr>
))}
                  </tbody>
                </table>
              </div>
            )}
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
