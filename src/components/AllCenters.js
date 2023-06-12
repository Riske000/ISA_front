import React, { useState, useEffect } from "react";
import axios from "axios";
import MedicalCenterDetails from "./MedicalCenterDetails";
import { useNavigate } from "react-router-dom";
import "../css/medicalCenters.css";

const AllCenters = (props) => {
  const navigate = useNavigate();
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(2);
  const [sort, setSort] = useState("Ascending");
  const [numberOfCenters, setNumberOfCenters] = useState(0);
  const [sortBy, setSortBy] = useState("centerName");
  const [pages, setPages] = useState([]);
  const [reqParams, setReqParams] = useState({
    field: sortBy,
    pageNo: currentPage,
    pageSize: size,
    sortMode: sort,
    centerName: "",
    adress: "",
  });
  const [minRating, setMinRating] = useState(0);
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    fetchData();
  }, [currentPage, reqParams]);

  const sortSetter = (event) => {
    setSortBy(event.target.value);
    setReqParams({
      ...reqParams,
      field: event.target.value,
    });
  };

  const sortDirSetter = (event) => {
    setSort(event.target.value);
    setReqParams({
      ...reqParams,
      sortMode: event.target.value,
    });
  };

  const handleMedicalCenterClick = (medicalCenter) => {
    setSelectedMedicalCenter(medicalCenter);
  };

  const setPage = (currentPage) => {
    setReqParams({
      ...reqParams,
      pageNo: currentPage,
    });
    setCurrentPage(currentPage);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/medical/getAllSorted",
        { params: reqParams }
      );

      setMedicalCenters(response.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/medical/search",
        {
          params: {
            centerName: reqParams.centerName,
            adress: reqParams.adress,
          },
        }
      );

      setMedicalCenters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = () => {
    axios
      .get("http://localhost:8080/api/medical/filter", {
        params: { minRating: minRating },
      })
      .then((response) => {
        setMedicalCenters(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleResetFilter = () => {
    setMinRating(0);
    fetchData();
  };

  const handleLogin = () => {
    navigate("/login");
  };

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
            <select
              id="sortBy"
              value={sortBy}
              name="sortBy"
              onChange={sortSetter}
              className="s1"
            >
              <option value="centerName">Center name</option>
              <option value="adress">Address</option>
              <option value="averageRating">Average rating</option>
            </select>
            <select
              id="sort"
              value={sort}
              name="sort"
              onChange={sortDirSetter}
              className="s1"
            >
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <div className="srch">
            <input
              type="text"
              placeholder="Search by center name"
              value={reqParams.centerName}
              onChange={(e) =>
                setReqParams({ ...reqParams, centerName: e.target.value })
              }
              className="input-search"
            />
            <input
              type="text"
              placeholder="Search by address"
              value={reqParams.adress}
              onChange={(e) =>
                setReqParams({ ...reqParams, adress: e.target.value })
              }
              className="input-search"
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="filt">
            Minimal Rating
            <input
              type="number"
              placeholder="Min Rating"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="input-search"
            />
            <button onClick={handleFilter}>Filter</button>
            <button onClick={handleResetFilter}>Reset</button>
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

          <div className="logout">
            {pages.map((page) => (
              <button
                key={page}
                className={`nav ${currentPage === page ? "active" : ""}`}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
            ))}
              {currentUser ? null : <button onClick={handleLogin} className="uloguj">Login</button>}

          </div>
        </div>
      )}
    </div>
  );
};

export default AllCenters;



