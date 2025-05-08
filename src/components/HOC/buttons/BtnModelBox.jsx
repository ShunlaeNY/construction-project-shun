import React from "react";
import "../../../assets/styles/buttons/btnModalBox.scss";
export default function btnModelBox({ cancel, save }) {
  return (
    <div className="btnModalBoxContainer">
      <button type="reset">{cancel}</button>
      <button type="submit">{save}</button>
    </div>
  );
}
