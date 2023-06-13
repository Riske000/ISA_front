import React, { useState, useEffect } from "react";
import axios from "axios";
import MedicalCenterDetails from "./MedicalCenterDetails";

const VisitedCenters = () => {
  const [medicalCenters, setMedicalCenters] = useState([]);

  useEffect(() => {
    fetchMedicalCenters();
  }, []);

  const fetchMedicalCenters = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      const response = await axios.get(
        `http://localhost:8080/api/medical/${userId}/medical-centers`,
        config
      );
      setMedicalCenters(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <h1>List of Medical Centers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {medicalCenters.map((medicalCenter) => (
            <tr key={medicalCenter.id}>
              <td>{medicalCenter.name}</td>
              <td>{medicalCenter.address}</td>
              <td>{medicalCenter.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitedCenters;
