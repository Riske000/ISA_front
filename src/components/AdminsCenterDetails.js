import React, { useState, useEffect } from "react";
import { FcEngineering } from "react-icons/fc";
import "../css/AdminsCenterDetails.css";

const AdminsCenterDetails = () => {
  const [medicalCenter, setMedicalCenter] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.medicalCenterId) {
          fetchMedicalCenter(data.medicalCenterId);
        } else if (data.medicalCenter && data.medicalCenter.id) {
          fetchMedicalCenter(data.medicalCenter.id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fetchMedicalCenter = (medicalCenterId) => {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:8080/api/medical/${medicalCenterId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicalCenter(data);
        setStartTime(data.startTime.substring(0, 5)); 
        setEndTime(data.endTime.substring(0, 5)); 
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const medicalCenterId = medicalCenter.id;
  
    const updatedMedicalCenter = {
      startTime: startTime,
      endTime: endTime,
    };
  
    fetch(`http://localhost:8080/api/medical/edit-working-hours/${medicalCenterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updatedMedicalCenter),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update working hours");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated Medical Center:", data);
        setIsEditable(false);
        setMedicalCenter((prevMedicalCenter) => ({
          ...prevMedicalCenter,
          startTime: updatedMedicalCenter.startTime,
          endTime: updatedMedicalCenter.endTime,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  if (!medicalCenter) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="center-container">
        <h1>{medicalCenter.centerName}</h1>
        <p>Address: {medicalCenter.adress}</p>
        <p>Description: {medicalCenter.description}</p>
        <p>Average Rating: {medicalCenter.averageRating}</p>
      </div>
      <div className="working-hours-container">
        <div className="working-hours-header">
          <p className="working-hours-title">Working Hours</p>
          <FcEngineering className={`edit-icon ${isEditable ? "active" : ""}`} onClick={handleEditClick} />
        </div>
        {isEditable ? (
          <div className="editable-fields">
            <p>Start Time:</p>
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <p>End Time:</p>
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        ) : (
          <div className="non-editable-fields">
            <p>Start Time: {medicalCenter.startTime}</p>
            <p>End Time: {medicalCenter.endTime}</p>
          </div>
        )}
        {!isEditable && (
          <h1 className="natpis">*Working days only!</h1>
        )}
      </div>
    </div>
  );
};

export default AdminsCenterDetails;
