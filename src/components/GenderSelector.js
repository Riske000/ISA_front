import React from "react";

function GenderSelector(props) {
  return (
    <div>
      <label htmlFor="gender">Gender:</label>
      <select id="gender" name="gender" onChange={props.onChange}>
        <option value="">Select a gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  );
}

export default GenderSelector;
