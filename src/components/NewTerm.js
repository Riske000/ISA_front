import React, { useState } from 'react';
import axios from 'axios';
import '../css/NewTerm.css';
import { FcLikePlaceholder, FcDepartment, FcGlobe, FcElectricalThreshold } from 'react-icons/fc';

const NewTerm = () => {
  const [dateTime, setDateTime] = useState('');
  const [medicalCenters, setMedicalCenters] = useState([]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get(`http://localhost:8080/api/term/medical-centers?dateTime=${dateTime}`, {
        headers,
      });
      const medicalCenters = response.data;
      setMedicalCenters(medicalCenters);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateTimeChange = (e) => {
    setDateTime(e.target.value);
  };

  return (
    <div>
      <h1 className="naslov">
        <FcLikePlaceholder />
        Reserve New Term
        <FcLikePlaceholder />
      </h1>
      <div className="search-container">
        <input type="datetime-local" value={dateTime} onChange={handleDateTimeChange} />
        <button onClick={handleSearch}>Search for Term</button>
      </div>
      <div className="results-container">
  <h2>Available Medical Centers</h2>
  {medicalCenters.length === 0 ? (
    <p>No available hospitals for the selected date and time.</p>
  ) : (
    medicalCenters.map((center) => (
      <div key={center.id} className="center-container" >
        <div className="info-container">
          <p>
            <span className="label"><FcDepartment size={30} /></span>
            <span className="value"><strong>Name:</strong> {center.centerName}</span>
          </p>
          <p>
            <span className="label"><FcGlobe size={30} /></span>
            <span className="value"><strong>Location:</strong> {center.adress}</span>
          </p>
          <p>
            <span className="label"><FcElectricalThreshold size={30} /></span>
            <span className="value"><strong>Average Grade:</strong> {center.averageRating}</span>
          </p>
        </div>
      </div>
    ))
  )}
</div>


    </div>
  );
};

export default NewTerm;
