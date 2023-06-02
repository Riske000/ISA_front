import React from "react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";

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

        //console.log(`Bearer ${localStorage.getItem("token")}`);
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
            const currentUser = JSON.stringify(data)

            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("userType", data.role);
            localStorage.setItem("userId", data.id);
            if (data.role === "RegisteredUser") {
              navigate("/homePageRegisteredUser");
            }
            if (data.role === "SystemAdministrator") {
              navigate("/homePageAdmin");
            }
            if (data.role === "CenterAdministrator") {
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
    <div>
      <form onSubmit={onLoginClickHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input onChange={handleChange} name="email" type="text" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            name="password"
            type="password"
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
          <button onClick={onRegistrateClickHandler}>Dont have acount?</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
