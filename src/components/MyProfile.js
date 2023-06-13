import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { FcEditImage, FcApproval, FcLike, FcRating, FcMindMap } from "react-icons/fc";
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

  const renderLoyaltyBenefits = (loyaltyCategory) => {
    switch (loyaltyCategory) {
      case 'Silver':
        return (
          <div>
            <strong className="benefits-title">
              Benefits
            </strong>
            <FcMindMap className="benefits-icon" />
            <ul>
              <li>5% discount on medical examinations for Silver users</li>
              <li>Free membership in loyalty club</li>
            </ul>
          </div>
        );
      case 'Gold':
        return (
          <div>
            <strong className="benefits-title">
              Benefits
            </strong>
            <FcMindMap className="benefits-icon" />
            <ul>
              <li>10% discount on medical examinations for Gold users</li>
              <li>Free shipping for online orders</li>
              <li>Personalized offers and recommendations</li>
            </ul>
          </div>
        );
      case 'Platinum':
        return (
          <div>
            <strong className="benefits-title">
              Benefits
            </strong>
            <FcMindMap className="benefits-icon" />
            <ul>
              <li>15% discount on medical examinations for Platinum users</li>
              <li>Special offers for Platinum users only</li>
              <li>VIP access to exclusive events</li>
              <li>Free gifts with every purchase</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderLoyaltyProgram = () => {
    if (user.role === "RegisteredUser") {
      return (
        <div className="loyalty-program-container">
          <div className="loyalty-program-header" onClick={handleToggleLoyaltyInfo}>
            <FcApproval className="loyalty-program-icon" />
            <strong>Loyalty Program</strong>
          </div>
          {showLoyaltyInfo && (
            <div className="loyalty-program-info">
              <div>
                <label htmlFor="loyaltyPoints">
                  Loyalty Points
                  <FcLike className="loyalty-program-icon-right" />
                </label>
                <input
                  name="loyaltyPoints"
                  type="text"
                  value={user.loyaltyPoints}
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="loyaltyCategory">
                  Loyalty Category
                  <FcRating className="loyalty-program-icon-right" />
                </label>
                <input
                  name="loyaltyCategory"
                  type="text"
                  value={user.loyaltyCategory}
                  disabled={true}
                />
              </div>
              {renderLoyaltyBenefits(user.loyaltyCategory)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="profile-container1">
      {renderLoyaltyProgram()}

      <form className="profile-form1" onSubmit={handleSubmit}>
        <span className="edit-button" onClick={handleEdit}>
          <FcEditImage />
        </span>

        <div>
          <label htmlFor="email">Email</label>
          <input name="email" type="text" value={user.email} disabled={true} />
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
          <label htmlFor="mobilePhone">Mobile Phone</label>
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
          <label htmlFor="jmbg">JMBG</label>
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
        {isEditing && (
          <div className="submit-buttonic">
            <button type="submitic" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MojProfil;