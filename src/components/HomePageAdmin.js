import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/logOutButton.css"

const HomePageAdmin = (props) => {
    const navigate = useNavigate();
    const onLogOutClick = (event) => {
        localStorage.clear();
        navigate('/');
      };

      return(
        <div>
            <button className="button-right_bottom" onClick={onLogOutClick}>Log out!</button>
        </div>
      )
}

export default HomePageAdmin;