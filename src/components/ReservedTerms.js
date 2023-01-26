import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import moment from "moment";
import axios from "axios";

const ReservedTerms = () => {
  const [reservedTerms, setReservedTerms] = useState([]);
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.get(
        `http://localhost:8080/api/term/getReservedTermForUser/${userId}`,
        { headers }
      );
      setReservedTerms(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelTerm = async (event) => {
    const termID = event.target.id;
    const token = localStorage.getItem("token");
    const reserveTermDTO = {
      termId: `${termID}`,
      userId: `${localStorage.getItem("userId")}`,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/term/cancelTerm/",
        {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify(reserveTermDTO),
        }
      );
      if (response.status === 200) {
        window.alert("You canceled term succesfully!");
        fetchData()
        return navigate("/HomePageRegisteredUser");
      }
      if (response.status === 400) {
        return window.alert("You cant reserve term right now!");
      }
    } catch (error) {}
  };

  return (
    <div>
      {reservedTerms.length === 0 && <p className="p-center">You dont have any reserved terms!</p>}
      {reservedTerms.length != 0 && (
        <table>
          <thead>
            <tr>
              <th>Medical center</th>
              <th>Date and time</th>
              <th>Duration</th>
              <th>Cancel term</th>
            </tr>
          </thead>
          <tbody>
            {reservedTerms.map((term) => (
              <tr key={term.id}>
                <td>{term.medicalCenter.centerName} </td>
                <td>{moment(term.dateOfTerm).format("DD/MM/YYYY, h:mm")}</td>
                <td>{term.duration} minutes</td>
                <td>
                  <button id={term.id} onClick={handleCancelTerm}>
                    Cancel term
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer>
        <p>
          If u dont come to reserved term u will get penalty. See My penalties tab for more information.
        </p>
      </footer>
    </div>
  );
};

export default ReservedTerms;
