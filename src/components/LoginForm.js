import React from "react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import '../css/Login.css';
import { FcBusinessman, FcKey } from 'react-icons/fc';

const LoginForm = (props) => {
  const navigate = useNavigate();
  const [loginDTO, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...loginDTO,
      [event.target.name]: event.target.value,
    });
  };

  const onLoginClickHandler = async (event) => {
    event.preventDefault();
  
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDTO),
    })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        const token = `Bearer ${data.token}`;
        localStorage.setItem("token", token);
  
        fetch(
          `http://localhost:8080/api/user/getCurrentUser/${loginDTO.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const currentUser = JSON.stringify(data);
            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("userType", data.role);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("isFirstLogin", data.firstLogin);
  
            if (data.role === "RegisteredUser") {
              navigate("/homePageRegisteredUser");
            }
            if (data.role === "SystemAdministrator") {
              navigate("/homePageAdmin");
            }
            if (data.role === "CenterAdministrator" && String(data.firstLogin) === "true") {
              navigate("/changePassword");
            }
            if (data.role === "CenterAdministrator" && String(data.firstLogin) === "false") {
              navigate("/homePageAdminCenter");
            }
          });
      })
      .catch((error) => {
        // Handle the error (e.g., display an error message to the user)
      });
  };

  const onRegistrateClickHandler = (event) => {
    return navigate("/registration");
  };

  return (
    <div className="formica">
      <form onSubmit={onLoginClickHandler}>
      <div>
        <label htmlFor="email">
          <FcBusinessman className="icon" size={30} />
          Email
        </label>
        <input onChange={handleChange} name="email" type="text" required style={{ width: "100%" }}/>
      </div>
      <div>
        <label htmlFor="password">
          <FcKey className="icon" size={30}/>
          Password
        </label>
        <input
          onChange={handleChange}
          name="password"
          type="password"
          className="sifr"
          required
          style={{ width: "92%" }}
        />
        </div>
        <div>
        <button type="submit" class="submit-button login-button">Login</button>
          <button type="submit" class="submit-button register-button" onClick={onRegistrateClickHandler}>Dont have acount?</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;