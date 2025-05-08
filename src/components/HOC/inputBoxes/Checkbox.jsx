import React from "react";
import "../../../assets/styles/inputBoxes/checkbox.scss";
export default function Checkbox({ label, id, value, name }) {
  return (
    <div className="checkboxContainer flexStart">
      <input type="checkbox" id={id} value={value} name={name} />
      <label for={id}>{label} </label>
    </div>
  );
}

