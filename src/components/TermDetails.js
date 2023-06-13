import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import moment from "moment";



const TermDetails = () => {
  const { termId } = useParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTermDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/term/getTerm/${termId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTerm(data);
          fetchQuestionnaire(data.user.id, data.questionnaire.id); 
        } else {
          console.error("Error fetching term details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching term details:", error);
      }
    };
  
    fetchTermDetails();
  }, [termId]);
  
  const fetchQuestionnaire = async (userId, questionnaireId) => { 
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/questionanaire/${questionnaireId}`, { 
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestionnaire(data);
      } else {
        console.error("Error fetching questionnaire:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
    }
  };

  const handleCancelByAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/term/cancel-admin/${termId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        console.log("Term canceled by admin");
      } else {
        console.error("Error canceling term by admin:", response.statusText);
      }
    } catch (error) {
      console.error("Error canceling term by admin:", error);
    }
  };

  const handleDidNotShowUp = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/term/cancel-penalty/${termId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        console.log("Term canceled with penalty");
      } else {
        console.error("Error canceling term with penalty:", response.statusText);
      }
    } catch (error) {
      console.error("Error canceling term with penalty:", error);
    }
  };

  const handleStartTerm = () => {
    navigate(`/termReview/${termId}/form`);
  };  

  if (!term || !questionnaire) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Term Details</h1>
      <p>Date: {term.dateOfTerm}</p>
      <p>Duration: {term.duration}</p>
      <p>Status: {term.statusOfTerm}</p>
      <p>Patient: {term.user.name} {term.user.surname}</p>

      <h2>Questionnaire</h2>
      <p>Have you donated blood in the previous 6 months? {questionnaire.question1.toString()}</p>
      <p> You are not allowed to donate blood because you have already done so
          in a period of less than 6 months! {questionnaire.question2.toString()}</p>
      <p>Do you currently have any symptoms? {questionnaire.question3.toString()}</p>
      <p>Have you had heavy meals in the past 24 hours? {questionnaire.question4.toString()}</p>
      <p>Are you currently taking any medications? {questionnaire.question5.toString()}</p>
      <p>Have you had a fever in the past 7 days? {questionnaire.question6.toString()}</p>
      <p>Have you recently traveled abroad? {questionnaire.question7.toString()}</p>
      <p>Have you ever had a reaction during blood extraction? {questionnaire.question8.toString()}</p>
      <p>Do you have any allergies to medications? {questionnaire.question9.toString()}</p>
      <p>Have you ever had hepatitis or any other liver disease? {questionnaire.question10.toString()}</p>
      <p>Do you have diabetes? {questionnaire.question11.toString()}</p>
      <p>Do you have any history of heart disease? {questionnaire.question12.toString()}</p>
      <p>Are you currently pregnant or breastfeeding? {questionnaire.question13.toString()}</p>
      <p>Have you had any major surgeries in the past month? {questionnaire.question14.toString()}</p>
      <p>Are you currently experiencing any symptoms such as dizziness, fatigue, or shortness of breath? {questionnaire.question15.toString()}</p>
  
      <button onClick={handleCancelByAdmin}>NOT SUITABLE</button>
      <button onClick={handleDidNotShowUp}>PENALTY</button>
      <button onClick={handleStartTerm}>START</button>
    </div>
  );
};

export default TermDetails;
