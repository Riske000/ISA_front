import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const token = localStorage.getItem("token");

const ChangePassword = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onLogOutClick = () => {
    localStorage.clear();
    navigate("/");
  };


  const handleChangePassword = async () => {
    try {
      const passwordData = {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      const response = await fetch(
        "http://localhost:8080/api/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(passwordData),
        }
      );

      console.log(response);
      if (response.ok) {
        localStorage.setItem("isFirstLogin", "false");
        navigate("/homePageAdminCenter")
      } else if (response.status === 401) {
      } else {
      }
    } catch (error) {
    }
  };

  return (
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

      <button className="button-right_bottom" onClick={onLogOutClick}>
        Log out
      </button>
    </div>
  );
};

export default ChangePassword;