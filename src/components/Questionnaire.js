import React from "react";
import { useState, useEffect } from "react";
import "../css/logOutButton.css";
import "../css/medicalCenters.css";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../css/form.css";

const Questionnaire = (props) => {
  const userID = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [questionnaireDTO, setQuestionnaireDTO] = useState({
    userId: userID,
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
    question11: "",
    question12: "",
    question13: "",
    question14: "",
    question15: "",
  });

  const onSubmitHandler = () => {
    fetch("http://localhost:8080/api/questionanaire/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `${token}` },
        body: JSON.stringify(questionnaireDTO),
      })
      .then((response) =>
      {
        //console.log(response.body)
        props.toProfile()
        return response.json()
      }
      )
  }

  const handleChange = (event) => {
    setQuestionnaireDTO({
      ...questionnaireDTO,
      [event.target.name]: event.target.value,
    });
    //console.log(questionnaireDTO);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="div_border">
        <label>Question 1</label>
        <div>
          <label>
            <input
              type="radio"
              name="question1"
              value="true"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="question1"
              value="false"
              onChange={handleChange}
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 2</label>
        <div>
          <label>
            <input
              type="radio"
              name="question2"
              value="true"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="question2"
              value="false"
              onChange={handleChange}
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 3</label>
        <div>
          <label>
            <input
              type="radio"
              name="question3"
              onChange={handleChange}
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question3"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 4</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question4"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question4"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 5</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question5"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question5"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 6</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question6"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question6"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 7</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question7"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question7"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 8</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question8"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question8"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 9</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question9"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question9"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 10</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question10"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question10"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 11</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question11"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question11"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 12</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question12"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question12"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 13</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question13"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question13"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 14</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question14"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question14"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>

      <div className="div_border">
        <label>Question 15</label>
        <div>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question15"
              value="true"
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              onChange={handleChange}
              name="question15"
              value="false"
              required
            />
            No
          </label>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Questionnaire;
