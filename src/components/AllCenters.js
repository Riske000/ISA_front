import React from "react";
import { useState, useEffect } from "react";
import { Link, parsePath, useNavigate } from "react-router-dom";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import axios from "axios";
import MedicalCenterDetails from "./MedicalCenterDetails";

const AllCenters = (props) => {
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(2);
  const [sort, setSort] = useState("Ascending");
  const [numberOfCenters, setNumberOfCenters] = useState(0);
  const [sortBy, setSortBy] = useState("centerName");
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [reqParams, setReqParams] = useState({
    field: sortBy,
    pageNo: currentPage,
    pageSize: size,
    sortMode: sort,
  });

  function count() {
    let tempPages = [];
    for (let i = 1; i <= Math.ceil(numberOfCenters / size); i++) {
      //console.log(i)
      tempPages.push(i);
    }
    setPages(tempPages);
  }
  
  const sortSetter = (event) => {
    setSortBy(event.target.value)
    setReqParams({
      ...reqParams,
      field: event.target.value,
    });
  };

  const sortDirSetter = (event) => {
    setSort(event.target.value)
    setReqParams({
      ...reqParams,
      sortMode: event.target.value,
    });

  };

  function handleMedicalCenterClick(medicalCenter) {
    setSelectedMedicalCenter(medicalCenter);
    //console.log(pages);
  }

  function setPage(currentPage) {
    setReqParams({
      ...reqParams,
      pageNo: currentPage,
    });
    setCurrentPage(currentPage);
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `${token}`,
        };
        const response = await axios.get(
          "http://localhost:8080/api/medical/getAllSorted/",
          { headers, params: reqParams }
        );
        const number = await axios.get(
          "http://localhost:8080/api/medical/getNumberOfCenters/",
          { headers }
        );
        setMedicalCenters(response.data.content);
        setNumberOfCenters(number.data);
        let ppp = count();
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [numberOfCenters, currentPage, reqParams]);

  return (
    <div>
      {selectedMedicalCenter ? (
        <MedicalCenterDetails
          returnToAll={setSelectedMedicalCenter}
          medicalCenter={selectedMedicalCenter}
        />
      ) : (
        <div>
          <div className="navbar">
            <select id="sortBy" value={sortBy} name="sortBy" onChange={sortSetter}>
              <option value="centerName">Center name</option>
              <option value="adress">Adress</option>
              <option value="averageRating">Average rating</option>
            </select>
            <select id="sort" value={sort} name="sort" onChange={sortDirSetter}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Description</th>
                <th>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {medicalCenters.map((medicalCenter) => (
                <tr
                  key={medicalCenter.id}
                  onClick={() => handleMedicalCenterClick(medicalCenter)}
                >
                  <td>{medicalCenter.centerName}</td>
                  <td>{medicalCenter.adress}</td>
                  <td>{medicalCenter.description}</td>
                  <td>{medicalCenter.averageRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="navbar">
            {pages.map((page) => (
              <button
                key={page}
                className={`nav ${currentPage === page ? "active" : ""}`}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCenters;
