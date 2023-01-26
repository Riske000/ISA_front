import React, { useState } from "react";
import GenderSelector from "./GenderSelector";
import { useNavigate } from "react-router-dom";
import "../css/form.css"
function RegistrationForm(props) {
  const navigate = useNavigate();
  var canRegistrate = "false";
  const [repeatPassword, setRepeatPassword] = useState("");
  const [registrationDTO, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    address: "",
    city: "",
    country: "",
    mobilePhone: "",
    jmbg: "",
    gender: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...registrationDTO,
      [event.target.name]: event.target.value,
    });
  };

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
  };
  //const handleSubmit = async (event) =>
  const onRegistrateHandler = async (event) => {
    event.preventDefault();
    if (registrationDTO.password === repeatPassword) {
      canRegistrate = "true";
    } else {
      window.alert("Passwords must match!");
    }

    if (registrationDTO.gender !== "") {
      canRegistrate = "true";
    } else {
      canRegistrate = "false";
      window.alert("Select gender!");
    }

    //console.log(repeatPassword);
    //console.log(registrationDTO);
    if (canRegistrate === "true") {
      fetch("http://localhost:8080/api/user/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationDTO),
      })
        .then((response) => {
          //const data =  response.json();
          if (response.status === 400) {
            console.log("dosao2");
            return window.alert("Email is taken!");
          }
          const details = {
            recipient: registrationDTO.email,
            msgBody: "",
            subject: "",
          };
          console.log(registrationDTO.email);
          fetch("http://localhost:8080/api/emailConfirm/sendMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: details,
          });
          console.log("dosao3");
          return navigate("/");
        })

        .catch((error) => {});
    }
  };

  const onCancelClickHandler = (event) => {
    return navigate("/");
  };

  return (
    <div>
      <form  onSubmit={onRegistrateHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            name="email"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            name="password"
            type="password"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="repeatpassword">Repeat password</label>
          <input
            onChange={handleRepeatPasswordChange}
            name="repeatpassword"
            type="password"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            name="name"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input
            onChange={handleChange}
            name="surname"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            onChange={handleChange}
            name="address"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            onChange={handleChange}
            name="city"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            onChange={handleChange}
            name="country"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="mobilephone">Mobile phone</label>
          <input
            onChange={handleChange}
            name="mobilePhone"
            type="text"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="jmbg">JMBG</label>
          <input
            onChange={handleChange}
            name="jmbg"
            type="text"
            pattern="[0-9]*"
            required
          ></input>
        </div>
        <div>
          <GenderSelector onChange={handleChange} />
        </div>
        <div class="buttons">
          <button type="submit">Registrate</button>
          <button onClick={onCancelClickHandler}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
