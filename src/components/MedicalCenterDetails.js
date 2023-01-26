import React from "react";
import { useState, useEffect } from "react";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const token = localStorage.getItem("token");

const MedicalCenterDetails = (props) => {
  const navigate = useNavigate();

  const [terms, setTerms] = useState([]);
  const medId = props.medicalCenter.id;
  function handleShowAllClick(event) {
    props.returnToAll(null);
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `${token}`,
        };
        const response = await axios.get(
          `http://localhost:8080/api/term/getTermsForCenter/${props.medicalCenter.id}`,
          { headers }
        );
        setTerms(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleReserveTerm = async (event) => {
    const termID = event.target.id;
    const token = localStorage.getItem("token");
    const reserveTermDTO = {
      termId: `${termID}`,
      userId: `${localStorage.getItem("userId")}`,
    };
    console.log(reserveTermDTO);
    try {
      const response = await fetch(
        "http://localhost:8080/api/term/reserveTerm/",
        {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify(reserveTermDTO),
        }
      );
      if (response.status === 200) {
        window.alert("You reserved term succesfully!");
        props.returnToAll(null);
        return navigate("/HomePageRegisteredUser");
      }
      if (response.status === 400) {
        return window.alert("You cant reserve term!");
      }
    } catch (error) {}
  };
  return (
    <div>
      <button onClick={handleShowAllClick}>Show all centers</button>
      <table>
        <thead>
          <tr>
            <th>Date and time</th>
            <th>Duration</th>
            <th>Reserve term</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term) => (
            <tr key={term.id}>
              <td>{moment(term.dateOfTerm).format("DD/MM/YYYY, HH:mm")}</td>
              <td>{term.duration}</td>
              <td>
                <button id={term.id} onClick={handleReserveTerm}>
                  Reserve term
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalCenterDetails;
