import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import moment from "moment";
import axios from "axios";

const HistoryOfVisits = () => {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState("Ascending");
  const [sortBy, setSortBy] = useState("date");
  const [reqParams, setReqParams] = useState({
    field: sortBy,
    pageNo: currentPage,
    pageSize: size,
    sortMode: sort,
  });

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.get(
        `http://localhost:8080/api/bloodGiving/${userId}`,
        { headers, params: reqParams }
      );
      setHistory(response.data.content);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [reqParams]);

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
  return (
    <div>
      {history.length === 0 && (
        <p className="p-center">You have never been to our center!</p>
      )}
      {history.length !== 0 && (
        <div>
          <div className="navbar">
            <select
              id="sortBy"
              value={sortBy}
              name="sortBy"
              onChange={sortSetter}
            >
              <option value="date">Date</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
            <select id="sort" value={sort} name="sort" onChange={sortDirSetter}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Medical center</th>
                <th>Date and time</th>
                <th>Duration</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {history.map((term) => (
                <tr key={term.id}>
                  <td>{term.medicalCenterName} </td>
                  <td>{moment(term.date).format("DD/MM/YYYY, h:mm")}</td>
                  <td>{term.duration} minutes</td>
                  <td>{term.price} RSD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryOfVisits;
