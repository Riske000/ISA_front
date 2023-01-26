import React from "react";
import { useState, useEffect } from "react";
import { Link, parsePath, useNavigate } from "react-router-dom";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import axios from "axios";
import MedicalCenterDetails from "./MedicalCenterDetails";
import QRCode from "qrcode.react";
import moment from "moment";

const QRcodes = () => {
  const [terms, setTerms] = useState([]);

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
      setTerms(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Medical center</th>
            <th>Date and time</th>
            <th>Duration</th>
            <th>QR code</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term) => (
            <tr key={term.id}>
              <td>{term.medicalCenter.centerName} </td>
              <td>{moment(term.dateOfTerm).format("DD/MM/YYYY, h:mm")}</td>
              <td>{term.duration} minutes</td>
              <td>
                <QRCode
                  value={`Your reservation information: \n 
                  Center name: ${term.medicalCenter.centerName} \n
                  Duration: ${term.duration}  \n 
                  Date and time: ${moment(term.dateOfTerm).format("DD/MM/YYYY, h:mm")}` }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QRcodes;
