import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/TermForm.css";

const TermForm = () => {
  const [dateOfTerm, setDateOfTerm] = useState(null);
  const [duration, setDuration] = useState("");
  const [statusOfTerm, setStatusOfTerm] = useState("");
  const [medicalCenterId, setMedicalCenterId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.medicalCenterId) {
          setMedicalCenterId(data.medicalCenterId);
        } else if (data.medicalCenter && data.medicalCenter.id) {
          setMedicalCenterId(data.medicalCenter.id);
        }

        if (data.medicalCenter && data.medicalCenter.startTime && data.medicalCenter.endTime) {
          setStartTime(data.medicalCenter.startTime);
          setEndTime(data.medicalCenter.endTime);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const adjustedDateOfTerm = new Date(dateOfTerm.getTime() + 2 * 60 * 60 * 1000);

    const termData = {
      dateOfTerm: adjustedDateOfTerm.toISOString(),
      duration,
      statusOfTerm,
      medicalCenterId,
    };

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/term", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(termData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSuccessMessage("Term successfully created");
        setDateOfTerm(null);
        setDuration("");
        setStatusOfTerm("");
        setMedicalCenterId("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const calculateEndTime = () => {
    if (dateOfTerm && duration !== "") {
      const endTime = new Date(dateOfTerm.getTime() + Number(duration) * 60 * 1000); 
      const adjustedEndTime = new Date(endTime.getTime() - 2 * 60 * 60 * 1000); 

      return adjustedEndTime.toISOString().substr(11, 5); 
    }
    return null;
  };

  const isWithinWorkingHours = () => {
    if (dateOfTerm && startTime && endTime) {
      const selectedTime = dateOfTerm.getTime();
      const startDateTime = new Date(dateOfTerm);
      startDateTime.setHours(startTime.substr(0, 2));
      startDateTime.setMinutes(startTime.substr(3, 2));
      const startDateTimeValue = startDateTime.getTime();
      const endDateTime = new Date(dateOfTerm);
      endDateTime.setHours(endTime.substr(0, 2));
      endDateTime.setMinutes(endTime.substr(3, 2));
      const endDateTimeValue = endDateTime.getTime();
      return selectedTime >= startDateTimeValue && selectedTime <= endDateTimeValue;
    }
    return false;
  };

  const filterTime = (time) => {
    if (startTime && endTime) {
      const selectedTime = new Date(time);
      const startDateTime = new Date(time);
      startDateTime.setHours(startTime.substr(0, 2));
      startDateTime.setMinutes(startTime.substr(3, 2));
      const startDateTimeValue = startDateTime.getTime();
      const endDateTime = new Date(time);
      endDateTime.setHours(endTime.substr(0, 2));
      endDateTime.setMinutes(endTime.substr(3, 2));
      const endDateTimeValue = endDateTime.getTime();
      return selectedTime >= startDateTimeValue && selectedTime <= endDateTimeValue;
    }
    return true;
  };

  return (
    <div>
    <h2>Blood donation terms</h2>
    <form onSubmit={handleSubmit} className="term-form-container">
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">&#10004;</span>
          <p>{successMessage}</p>
        </div>
      )}
      <div>
        <label>Date and Time:</label>
        <DatePicker
          selected={dateOfTerm}
          onChange={(date) => setDateOfTerm(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          filterTime={filterTime}
          className="date"
        />
        {!isWithinWorkingHours() && (
          <p className="error-message">Select a time within business hours</p>
        )}
      </div>
      <div>
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />
      </div>
      <div>
        <label>Termin status:</label>
        <select
          value={statusOfTerm}
          onChange={(event) => setStatusOfTerm(event.target.value)}
        >
          <option value="">Status</option>
          <option value="Free">Free</option>
          <option value="Taken">Busy</option>
        </select>
      </div>
      <div>
        <label>Medical Center ID:</label>
        <input
          type="number"
          value={medicalCenterId}
          onChange={(event) => setMedicalCenterId(event.target.value)}
          disabled
        />
      </div>
      <button type="submit" disabled={!isWithinWorkingHours()}>Create term</button>
    </form>
    </div>
  );
};

export default TermForm;
