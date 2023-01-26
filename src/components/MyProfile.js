import React from "react";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";


const MyProfile = () => {
  const [questionnaire, setQuestionnaire] = useState({})
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const headers = {
          Authorization: `${token}`,
        };
        const response = await axios.get(
          `http://localhost:8080/api/questionanaire/getLastForUser/${userId}`,
          { headers }
        );
        setQuestionnaire(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="profile">
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" type="text" value={user.email} disabled></input>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input name="name" type="text" value={user.name} disabled></input>
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input name="surname" type="text" value={user.surname} disabled></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input name="address" type="text" value={user.address} disabled></input>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input name="city" type="text" value={user.city} disabled></input>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input name="country" type="text" value={user.country} disabled></input>
        </div>
        <div>
          <label htmlFor="mobilephone">Mobile phone</label>
          <input name="mobilePhone" type="text" value={user.mobilePhone} disabled></input>
        </div>
        <div>
          <label htmlFor="jmbg">JMBG</label>
          <input name="jmbg" type="text" value={user.jmbg} disabled></input>
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <input name="gender" type="text" value={user.gender} disabled></input>
        </div>
        <div>
          <label htmlFor="lastQ">Last questionnaire date</label>
          {questionnaire!==null && <input name="lastQ" type="text" value={moment(questionnaire.date).format("DD/MM/YYYY, HH:mm")} disabled></input>}
          {questionnaire===null && <input name="lastQ" type="text" value="No questionnaire!" disabled></input>}
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
