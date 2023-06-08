import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalCenters = () => {
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCenters, setFilteredCenters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicalCenters();
  }, []);

  const fetchMedicalCenters = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/medical/getAll");
      if (response.ok) {
        const data = await response.json();
        setMedicalCenters(data);
        setFilteredCenters(data);
      }
    } catch (error) {
      console.error("Error fetching medical centers:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = medicalCenters.filter((center) =>
      center.centerName.toLowerCase().includes(query)
    );
    setFilteredCenters(filtered);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div>
        <button onClick={navigateToLogin}>Login</button>
      </div>
      <h2>Medical Centers</h2>
      <input
        type="text"
        placeholder="Search by center name"
        value={searchQuery}
        onChange={handleSearch}
      />
      <ul>
        {filteredCenters.map((center) => (
          <li key={center.id}>{center.centerName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalCenters;
