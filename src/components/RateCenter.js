import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RateCenter = () => {
  const [userId, setUserId] = useState(0);
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Preuzimanje korisnikovog ID-a iz local storage-a
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    const fetchMedicalCenters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/medical/${userId}/medical-centers`, {
          headers: {
            Authorization: token,
          },
        });
        
        setMedicalCenters(response.data);
        console.log(medicalCenters);
    } catch (error) {
        console.error('Greška prilikom dobavljanja medicinskih centara:', error);
      }
    };

    fetchMedicalCenters();
  }, [userId]);

  const handleMedicalCenterChange = (event) => {
    setSelectedMedicalCenter(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/rate-center/rate', {
        userId: userId,
        medicalCenterId: selectedMedicalCenter,
        rating: rating,
      }, {
        headers: {
          Authorization: token,
        },
      });
      console.log('Centar je uspešno ocenjen.');
    } catch (error) {
      console.error('Greška prilikom ocenjivanja medicinskog centra:', error);
    }
  };

  return (
    <div>
      <h2>Oceni medicinski centar</h2>
      <form onSubmit={handleSubmit}>
        <p>Prijavljeni korisnik ID: {userId}</p>
        <label>
          Izaberi medicinski centar:
          <select value={selectedMedicalCenter} onChange={handleMedicalCenterChange}>
            <option value="">Izaberi centar</option>
            {medicalCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Ocjena:
          <input type="number" min="0" max="5" value={rating} onChange={handleRatingChange} />
        </label>
        <br />
        <button type="submit">Pošalji ocjenu</button>
      </form>
    </div>
  );
};

export default RateCenter;
