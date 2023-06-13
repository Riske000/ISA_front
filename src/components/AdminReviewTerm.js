import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem("token");

const AdminReviewTerm = () => {
  const navigate = useNavigate();
  const { termId } = useParams();
  const [description, setDescription] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [deciliters, setDeciliters] = useState(0);
  const [needleNo, setNeedleNo] = useState(0);
  const [cottonWoolNo, setCottonWoolNo] = useState(0);
  const [alcoholNo, setAlcoholNo] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const description = event.target.elements.description.value;
    const needleNo = parseInt(event.target.elements.needleNo.value);
    const cottonWoolNo = parseInt(event.target.elements.cottonWoolNo.value);
    const alcoholNo = parseInt(event.target.elements.alcoholNo.value);
    const bloodType = event.target.elements.bloodType.value;
    const deciliters = parseFloat(event.target.elements.deciliters.value);
  
    try {
      const response = await fetch("http://localhost:8080/api/term/review?termId=" + termId +
      "&description=" + encodeURIComponent(description) +
      "&needleNo=" + needleNo +
      "&cottonWoolNo=" + cottonWoolNo +
      "&alcoholNo=" + alcoholNo +
      "&bloodType=" + bloodType +
      "&deciliters=" + deciliters, {
        method: "POST",
        headers: {
            Authorization: token,
          },
        body: JSON.stringify({
          termId: termId,
          description: description,
          needleNo: needleNo,
          cottonWoolNo: cottonWoolNo,
          alcoholNo: alcoholNo,
          bloodType: bloodType,
          deciliters: deciliters,
        }),
      });
  
      if (response.ok) {
        console.log("Term reviewed by admin");
        navigate("/homePageAdminCenter");
      } else {
        console.error("Error reviewing term by admin:", response.statusText);
      }
    } catch (error) {
      console.error("Error reviewing term by admin:", error);
    }
  };

  return (
    <div>
      <h1>Admin Review Term</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="bloodType">Blood Type:</label>
        <select
          id="bloodType"
          name="bloodType"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          required
        >
          <option value="">Select Blood Type</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="AB">AB</option>
          <option value="O">O</option>
        </select>

        <label htmlFor="deciliters">Deciliters:</label>
        <input
          type="number"
          id="deciliters"
          name="deciliters"
          min="0"
          step="0.1"
          value={deciliters}
          onChange={(e) => setDeciliters(parseFloat(e.target.value))}
          required
        />

        <label htmlFor="needleNo">Needle:</label>
        <input
          type="number"
          id="needleNo"
          name="needleNo"
          min="0"
          value={needleNo}
          onChange={(e) => setNeedleNo(parseInt(e.target.value))}
          required
        />

        <label htmlFor="cottonWoolNo">Cotton Wool:</label>
        <input
          type="number"
          id="cottonWoolNo"
          name="cottonWoolNo"
          min="0"
          value={cottonWoolNo}
          onChange={(e) => setCottonWoolNo(parseInt(e.target.value))}
          required
        />

        <label htmlFor="alcoholNo">Alcohol:</label>
        <input
          type="number"
          id="alcoholNo"
          name="alcoholNo"
          min="0"
          value={alcoholNo}
          onChange={(e) => setAlcoholNo(parseInt(e.target.value))}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminReviewTerm;
