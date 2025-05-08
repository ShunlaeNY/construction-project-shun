import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFetchData } from "../UseFetchData";
import {jwtDecode} from "jwt-decode";

export default function TopMenu() {
  const token = localStorage.getItem("accessToken");
  // console.log(token);
  let adminId = null;
  if(token){
    try {
      const decoded = jwtDecode(token);
      // console.log("decoded token:",decoded);
      adminId = decoded.id;
    } catch (err) {
      console.log("Invalid token:", err);
    }
  }
  
  const {
      data: AdminData,
      loading,
      error
  } = useFetchData(`http://localhost:8383/staff/getbyid/${adminId}`);
  // console.log(AdminData.image);
  const image = AdminData.image;
  const adminName = AdminData.name;


  const { pathname } = useLocation();
  const navigate = useNavigate();
  const titles = {
    "/home": "Home",
    "/schedule": "Schedule",
    "/site": "List of Sites",
    "/staff": "List of Staffs",
    "/vehicle": "List of Vehicles",
    "/business-partner": "List of Business Partners",
    "/operation-type": "List of Operation Types",
    "/userprofile": "User Profile",
  };
  const menuTitle = titles[pathname];
  return (
    <section className="topMenu">
      <div className="menuTitle">
        <button onClick={()=> navigate("/home")} style={{backgroundColor:"transparent",border:"none"}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0L10 2L4 8L10 14L8 16L0 8L8 0Z"
              fill="#F27D14"
            />
          </svg>
        </button>
        <h2>{menuTitle}</h2>
      </div>
      <div className="userProfile">
      <p>Welcome Back! <span style={{color:'#f27d14'}}>{adminName ? adminName.split(' ')[0] : ''}</span></p>
      <div>
          <Link to="/userprofile">
            <img src={image} alt="profile" className="profilePopUp" />
          </Link>
        </div>
      </div>
    </section>
  );
}
