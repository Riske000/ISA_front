import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Questionnaire.css";
import { FcDepartment, FcGlobe, FcElectricalThreshold, FcAlarmClock } from 'react-icons/fc';

const Questionnaire = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { center, dateTime } = location.state;
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationButton, setShowConfirmationButton] = useState(false);
  const [medicalCenterId, setMedicalCenterId] = useState("");
  const [questionnaireId, setQuestionnaireId] = useState(null);



  const [questionnaireDTO, setQuestionnaireDTO] = useState({
    userId: localStorage.getItem("userId"),
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
    question11: "",
    question12: "",
    question13: "",
    question14: "",
    question15: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    surname: "",
    mobilePhone: "",
    jmbg: "",
  });

  const goBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUserInfo({
      name: currentUser.name,
      surname: currentUser.surname,
      mobilePhone: currentUser.mobilePhone,
      jmbg: currentUser.jmbg,
    });
    setMedicalCenterId(center.medicalCenter.id);
    console.log("Medical Center ID:", center.medicalCenter.id);

    console.log("DateTime:", dateTime);
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      setSuccessMessage("You have filled in the questionnaire successfully. Proceed to reserving your term.");

      setShowConfirmationButton(true);
    }
  }, [formSubmitted]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (questionnaireDTO.question1 === "true") {
      setShowErrorMessage(true);
      return; 
    }
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      };

      const response = await axios.post("http://localhost:8080/api/questionanaire", questionnaireDTO, {
        headers,
      });

      const questionnaireId = response.data.id;

      setQuestionnaireId(questionnaireId); 

      confirmReservation(questionnaireId);

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setQuestionnaireDTO({
      ...questionnaireDTO,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "question1" && e.target.value === "true") {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
    }
  
  };

  const confirmReservation = async (questionnaireId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      };
      const url = `http://localhost:8080/api/term/find-term-id?medicalCenterId=${medicalCenterId}&dateTime=${(dateTime)}`;

      const requestBody = {
        medicalCenterId: medicalCenterId,
        dateTime: dateTime
      };
  
      const response = await axios.post(url, requestBody, {
        headers,
      });

      const termId = response.data;
      console.log('termId:', termId);
    
      const reserveUrl = `http://localhost:8080/api/term/reserve?termId=${termId}&userId=${questionnaireDTO.userId}&questionnaireId=${questionnaireId}`;
      await axios.post(reserveUrl, null, {
        headers,
      });

      console.log('Term reserved successfully');
      
      window.alert('Your reservation is confirmed');

      navigate(-1);
    

    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  return (
    <div>
      <h1 className="center-title">Chosen Term:</h1>

      <div className="center-info-container">
        <span className="label"><FcDepartment size={30} /></span>
        <span className="value"><strong>Name of Medical Center:</strong> {center.medicalCenter.centerName}</span>
      </div>

      <div className="center-info-container">
        <span className="label"><FcGlobe size={30} /></span>
        <span className="value"><strong>Location:</strong> {center.medicalCenter.adress}</span>
      </div>

      <div className="center-info-container">
        <span className="label"><FcElectricalThreshold size={30} /></span>
        <span className="value"><strong>Average Grade:</strong> {center.medicalCenter.averageRating}</span>
      </div>

      <div className="dateTime-container">
        <span className="label"><FcAlarmClock size={30} /></span>
        <span className="datetime"><strong>Date and Time:</strong> {new Date(dateTime).toLocaleString()}</span>
      </div>

      <h1 className="center-title">Your Information:</h1>

      <div className="center-info-container">
        <span className="value"><strong>First Name:</strong> {userInfo.name}</span>
    
        <span className="value"><strong>Last Name:</strong> {userInfo.surname}</span>
      
        <span className="value"><strong>Mobile Phone:</strong> {userInfo.mobilePhone}</span>
 
        <span className="value"><strong>JMBG:</strong> {userInfo.jmbg}</span>
      </div>

      <h2 className="nasl">Please fill in this Questionnaire before confirming your Term reservation</h2>
      

      
      {formSubmitted ? (
        <div className="successs-message">{successMessage}</div>
      ) : (
      <form className="questionnaire-form" onSubmit={onSubmitHandler} style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div className="question">
          <label>Have you donated blood in the previous 6 months?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question1"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>
        {showErrorMessage && (
        <p style={{ color: "red" }}>
          You are not allowed to donate blood because you have already done so
          in a period of less than 6 months!
        </p>
      )}

        <div className="question">
          <label>Do you currently have any symptoms?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question2"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you had heavy meals in the past 24 hours?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question3"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Are you currently taking any medications?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question4"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question4"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you had a fever in the past 7 days?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question5"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question5"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you recently traveled abroad?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question6"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question6"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you experienced any blood clotting issues?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question7"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question7"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you ever had a reaction during blood extraction?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question8"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question8"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Do you have any allergies to medications?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question9"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question9"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you ever had hepatitis or any other liver disease?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question10"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question10"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Do you have diabetes?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question11"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question11"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Do you have any history of heart disease?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question12"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question12"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Are you currently pregnant or breastfeeding?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question13"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question13"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Have you had any major surgeries in the past month?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question14"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question14"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <label>Are you currently experiencing any symptoms such as dizziness, fatigue, or shortness of breath?</label>
          <div>
            <label>
              <input
                type="radio"
                name="question15"
                value="true"
                onChange={handleChange}
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question15"
                value="false"
                onChange={handleChange}
                required
              />
              No
            </label>
          </div>
        </div>
    

        <button className="submit-button" type="submit">
          Submit
        </button>
        {showErrorMessage && (
        <p style={{ color: "red" }}>
          You are not allowed to donate blood because you have already done so
          in a period of less than 6 months!
        </p>
      )}
      
      </form>
      )}

      {showConfirmationButton && (
          <button className="confirm-button" onClick={confirmReservation}>
            Confirm reservation
          </button>
        )}
  

      <button className="go-back-button" onClick={goBack}>
        Go back
      </button>
    </div>
  );
};

export default Questionnaire;


