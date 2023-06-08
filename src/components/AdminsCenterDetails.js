import React, { useState, useEffect } from "react";
import { FcEngineering } from "react-icons/fc";
import "../css/AdminsCenterDetails.css";

const AdminsCenterDetails = () => {
  const [medicalCenter, setMedicalCenter] = useState(null);
  const [isWorkingHoursEditable, setIsWorkingHoursEditable] = useState(false);
  const [isCenterEditable, setIsCenterEditable] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [centerName, setCenterName] = useState("");
  const [adress, setAdress] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [administrators, setAdministrators] = useState([]);

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
          fetchAdministrators(data.medicalCenterId);
        } else if (data.medicalCenter && data.medicalCenter.id) {
          fetchMedicalCenter(data.medicalCenter.id);
          fetchAdministrators(data.medicalCenter.id);
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
        setCenterName(data.centerName);
        setAdress(data.adress);
        setDescription(data.description);
        setRating(data.averageRating);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchAdministrators = (medicalCenterId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/user/administrators/${medicalCenterId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAdministrators(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleWorkingHoursEditClick = () => {
    setIsWorkingHoursEditable(!isWorkingHoursEditable);
  };

  const handleCenterEditClick = () => {
    setIsCenterEditable(!isCenterEditable);
  };

  const handleCenterSubmit = () => {
    const token = localStorage.getItem("token");
    const medicalCenterId = medicalCenter.id;

    const updatedMedicalCenter = {
      centerName: centerName,
      adress: adress,
      description: description,
      averageRating: rating
    };

    fetch(`http://localhost:8080/api/medical/edit-info/${medicalCenterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updatedMedicalCenter),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update center");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated Medical Center:", data);
        setIsCenterEditable(false);
        setMedicalCenter((prevMedicalCenter) => ({
          ...prevMedicalCenter,
          centerName: updatedMedicalCenter.centerName,
          adress: updatedMedicalCenter.adress,
          description: updatedMedicalCenter.description,
          averageRating: updatedMedicalCenter.averageRating
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangePassword = async () => {
    try {
      const email = localStorage.getItem("email");
      const oldPassword = ""; // Get the old password from the user input
      const newPassword = ""; // Get the new password from the user input
  
      // Make an API call to the changePassword endpoint
      const response = await fetch("/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
  
      if (response.ok) {
        // Password successfully changed
        // You can handle the success case here (e.g., show a success message)
      } else if (response.status === 401) {
        // Incorrect old password
        // You can handle the error case here (e.g., show an error message)
      } else {
        // Other error occurred
        // You can handle the error case here (e.g., show an error message)
      }
    } catch (error) {
      // Handle any potential errors from the API call
      // You can handle the error case here (e.g., show an error message)
    }
  };

  const handleWorkingHoursSubmit = () => {
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
        setIsWorkingHoursEditable(false);
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

  const handleCenterNameChange = (event) => {
    setCenterName(event.target.value);
  };

  const handleAdressChange = (event) => {
    setAdress(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  if (!medicalCenter) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="center-container">
        <div className="center-header">
          <p className="center-title">Medical Center</p>
          <FcEngineering
            className={`edit-icon ${isCenterEditable ? "active" : ""}`}
            onClick={handleCenterEditClick}
          />
        </div>
        {isCenterEditable ? (
          <div className="editable-fields">
            <p>Name:</p>
            <input
              type="text"
              value={centerName}
              onChange={handleCenterNameChange}
            />
            <p>Address:</p>
            <input
              type="text"
              value={adress}
              onChange={handleAdressChange}
            />
            <p>Description:</p>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
            />
            <p>Rating:</p>
            <input
              type="text"
              value={rating}
              onChange={handleRatingChange}
            />
            <button onClick={handleCenterSubmit}>Submit</button>
          </div>
        ) : (
          <div className="non-editable-fields">
            <p>Name: {centerName}</p>
            <p>Address: {adress}</p>
            <p>Description: {description}</p>
            <p>Rating: {rating}</p>
          </div>
        )}
      </div>

      <div className="working-hours-container">
        <div className="working-hours-header">
          <p className="working-hours-title">Working Hours</p>
          <FcEngineering
            className={`edit-icon ${isWorkingHoursEditable ? "active" : ""}`}
            onClick={handleWorkingHoursEditClick}
          />
        </div>
        {isWorkingHoursEditable ? (
          <div className="editable-fields">
            <p>Start Time:</p>
            <input
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <p>End Time:</p>
            <input
              type="text"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            <button onClick={handleWorkingHoursSubmit}>Submit</button>
          </div>
        ) : (
          <div className="non-editable-fields">
            <p>Start Time: {startTime}</p>
            <p>End Time: {endTime}</p>
          </div>
        )}
      </div>

      <div className="administrators-container">
        <div className="administrators-header">
          <p className="administrators-title">Administrators</p>
        </div>
        <ul className="administrators-list">
        {administrators && Array.isArray(administrators) ? (
  <ul className="administrators-list">
    {administrators.map((administrator) => (
      <li key={administrator.id}>{administrator.name}</li>
    ))}
  </ul>
) : (
  <p>No administrators found.</p>
)}
        </ul>
      </div>
    </div>
  );
};

export default AdminsCenterDetails;
