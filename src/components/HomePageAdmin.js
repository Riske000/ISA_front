import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/logOutButton.css"
import AllCenters from "./AllCenters";
import MyProfile from "./MyProfile";

const HomePageAdmin = (props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All centers");
    const onLogOutClick = (event) => {
        localStorage.clear();
        navigate('/');
      };

      return (
        <div>
          
    
            <div>
              <div className="tab-bar">
                <div
                  className={`tab ${activeTab === "My profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("My profile")}
                >
                  My profile
                </div>
                <div
                  className={`tab ${activeTab === "All Centers" ? "active" : ""}`}
                  onClick={() => setActiveTab("All Centers")}
                >
                  All Centers
                </div>
               
              </div>
              <div>
                {activeTab === "My profile" && <MyProfile />}
                {activeTab === "All Centers" && <AllCenters />}
               
              </div>
              <button className="button-right_bottom" onClick={onLogOutClick}>
                Log out
              </button>
            </div>
          
        </div>
      );
    };

export default HomePageAdmin;