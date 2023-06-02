import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { FcEditImage, FcApproval } from "react-icons/fc";
import "../css/MyProfile.css";

const MojProfil = () => {
  const [questionnaire, setQuestionnaire] = useState({});
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoyaltyInfo, setShowLoyaltyInfo] = useState(false);


  const [editedUser, setEditedUser] = useState({
    name: "",
    surname: "",
    address: "",
    city: "",
    country: "",
    mobilePhone: "",
    jmbg: "",
    gender: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setUser(user);
    setEditedUser({ ...user });
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.put(
        `http://localhost:8080/api/user/${userId}`,
        editedUser,
        { headers }
      );
  
      setUser(response.data);
      setIsEditing(false);
      setIsSubmitting(false);
      setEditedUser(response.data);
  
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      console.log(editedUser);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  
  const handleToggleLoyaltyInfo = () => {
    setShowLoyaltyInfo(!showLoyaltyInfo);
  };

  return (
    <div className="profile-container1">
      <form className="profile-form1" onSubmit={handleSubmit}>
        <span className="edit-button" onClick={handleEdit}>
          <FcEditImage />
        </span>

        

        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            value={user.email}
            disabled={true}
          />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            key={isEditing ? "edited_name" : "user_name"}
            name="name"
            type="text"
            value={isEditing ? editedUser.name : user.name}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input
            key={isEditing ? "edited_surname" : "user_surname"}
            name="surname"
            type="text"
            value={isEditing ? editedUser.surname : user.surname}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            key={isEditing ? "edited_address" : "user_address"}
            name="address"
            type="text"
            value={isEditing ? editedUser.address : user.address}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            key={isEditing ? "edited_city" : "user_city"}
            name="city"
            type="text"
            value={isEditing ? editedUser.city : user.city}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            key={isEditing ? "edited_country" : "user_country"}
            name="country"
            type="text"
            value={isEditing ? editedUser.country : user.country}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mobilephone">Mobile phone</label>
          <input
            key={isEditing ? "edited_mobilePhone" : "user_mobilePhone"}
            name="mobilePhone"
            type="text"
            value={isEditing ? editedUser.mobilePhone : user.mobilePhone}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="jmbg">SSN</label>
          <input
            key={isEditing ? "edited_jmbg" : "user_jmbg"}
            name="jmbg"
            type="text"
            value={isEditing ? editedUser.jmbg : user.jmbg}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <input
            key={isEditing ? "edited_gender" : "user_gender"}
            name="gender"
            type="text"
            value={isEditing ? editedUser.gender : user.gender}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastQ">Date of last Questionnaire</label>
          <input
            name="lastQ"
            type="text"
            value={
              questionnaire !== null
                ? moment(questionnaire.date).format("DD/MM/YYYY, HH:mm")
                : "Nema upitnika!"
            }
            disabled
          />
        </div>


        {isEditing && (
          <div className="submit-button1-container">
            <button className="submit-button1" type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        )}
      </form>

      <div className="loyalty-container">
        <div className="loyalty-header" onClick={handleToggleLoyaltyInfo}>
          <div className="loyalty-toggle">
            <FcApproval className="loyalty-icon" />
            <strong>Loyalty program</strong>
          </div>
        </div>
        {showLoyaltyInfo && (
          <div className="loyalty-info">
            <div>
              <label htmlFor="loyaltyPoints">Loyalty Points</label>
              <input
                name="loyaltyPoints"
                type="text"
                value={user.loyaltyPoints}
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="loyaltyCategory">Loyalty Category</label>
              <input
                name="loyaltyCategory"
                type="text"
                value={user.loyaltyCategory}
                disabled={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default MojProfil;
