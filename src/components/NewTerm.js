import React, { useState } from 'react';
import axios from 'axios';
import '../css/NewTerm.css';
import { FcLikePlaceholder, FcDepartment, FcGlobe, FcElectricalThreshold } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const NewTerm = () => {
  const [dateTime, setDateTime] = useState('');
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [sortedByRating, setSortedByRating] = useState(false);
  const navigate = useNavigate();
  const currentDateTime = new Date().toISOString().slice(0, 16);


  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get(`http://localhost:8080/api/term/medical-centers?dateTime=${dateTime}`, {
        headers,
      });
      let medicalCentersData = response.data;

      if (sortedByRating) {
        medicalCentersData.sort((a, b) => b.medicalCenter.averageRating - a.medicalCenter.averageRating);
      }

      setMedicalCenters(medicalCentersData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateTimeChange = (e) => {
    const selectedDateTime = new Date(e.target.value).getTime();
    const currentDateTime = new Date().getTime();
  
    if (selectedDateTime < currentDateTime) {
      const formattedCurrentDateTime = new Date().toISOString().slice(0, 16);
      setDateTime(formattedCurrentDateTime);
    } else {
      setDateTime(e.target.value);
    }
  };

  const handleReserve = (center) => {
    navigate('/questionnaire', { state: { center, dateTime } });
  };

  const handleSortByRating = () => {
    const sortedMedicalCenters = [...medicalCenters];
  
    if (sortedByRating) {
      sortedMedicalCenters.sort((a, b) => a.medicalCenter.averageRating - b.medicalCenter.averageRating);
    } else {
      sortedMedicalCenters.sort((a, b) => b.medicalCenter.averageRating - a.medicalCenter.averageRating);
    }
  
    setMedicalCenters(sortedMedicalCenters);
    setSortedByRating(!sortedByRating);
  };

  return (
    <div>
      <h1 className="naslov">
        <FcLikePlaceholder />
        Reserve New Term
        <FcLikePlaceholder />
      </h1>
      <div className="search-container">
        <input type="datetime-local" value={dateTime} onChange={handleDateTimeChange} min={currentDateTime}/>
        <button className="dugme" onClick={handleSearch}>Search for Term</button>
      </div>
      <div className="results-container">
      {medicalCenters.length > 1 && (
        <div className="sort-container">
          <button className="sort-button" onClick={handleSortByRating}>
            {sortedByRating ? 'Sort by Rating (Descending)' : 'Sort by Rating (Ascending)'}
          </button>
        </div>
      )}
        <h2>Available Medical Centers</h2>
        {medicalCenters.length === 0 ? (
          <p>No available hospitals for the selected date and time.</p>
        ) : (
          medicalCenters.map((center, index) => (
            <div key={center.medicalCenter.id}>
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
