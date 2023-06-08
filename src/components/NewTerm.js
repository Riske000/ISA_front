import React, { useState } from 'react';
import axios from 'axios';
import '../css/NewTerm.css';
import { FcLikePlaceholder, FcDepartment, FcGlobe, FcElectricalThreshold } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const NewTerm = () => {
  const [dateTime, setDateTime] = useState('');
  const [medicalCenters, setMedicalCenters] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get(`http://localhost:8080/api/term/medical-centers?dateTime=${dateTime}`, {
        headers,
      });
      const medicalCentersData = response.data;
      setMedicalCenters(medicalCentersData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateTimeChange = (e) => {
    setDateTime(e.target.value);
  };

  const handleReserve = (center) => {
    navigate('/questionnaire', { state: { center, dateTime } });
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
        <button className="dugme" onClick={handleSearch}>Search for Term</button>
      </div>
      <div className="results-container">
        <h2>Available Medical Centers</h2>
        {medicalCenters.length === 0 ? (
          <p>No available hospitals for the selected date and time.</p>
        ) : (
          medicalCenters.map((center, index) => (
            <div key={center.medicalCenter.id} >
              <div className="center-info">
                <span className="label"><FcDepartment size={30} /></span>
                <span className="value"><strong>Name:</strong> {center.medicalCenter.centerName}</span>
              </div>
              <div className="center-info">
                <span className="label"><FcGlobe size={30} /></span>
                <span className="value"><strong>Location:</strong> {center.medicalCenter.adress}</span>
              </div>
              <div className="center-info">
                <span className="label"><FcElectricalThreshold size={30} /></span>
                <span className="value"><strong>Average Grade:</strong> {center.medicalCenter.averageRating}</span>
              </div>
              <button className="reserve-button" onClick={() => handleReserve(center)}>
                Reserve
              </button>
              {index !== medicalCenters.length - 1 && <hr className="center-divider" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewTerm;
