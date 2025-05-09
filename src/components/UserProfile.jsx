import React, { useState, useEffect } from "react";
import "../assets/styles/accInfo.scss";
import { useFetchData } from "./HOC/UseFetchData";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import ImageUpload from "./HOC/inputBoxes/ImageUpload";
import axios from "axios";

export default function UserProfile() {
  const [errors, setErrors] = useState({});
  const [editStatus, setEditStatus] = useState(false);
  const [formData, setFormData] = useState();
  const token = localStorage.getItem("accessToken");
  let id;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      id = decoded.id;
    } catch (err) {
      console.log("Invalid token:", err);
    }
  }

  console.log("ID ", id);
  const { data: userData,refetch:refetchUserDatas } = useFetchData(
    `http://localhost:8383/staff/getbyid/${id}`
  );
useEffect(() => {
  if (userData) {
    setFormData({
      name:userData.name,
      email:userData.email,
      phoneNumber:userData.phoneNumber,
      address:userData.address,
      dob:userData.dob,
      joinedDate:userData.joinedDate,
      image:userData.image,
      password:""

    });
  }
}, [userData]);

  console.log("UserData  ", userData);
  const handleEditProfile = () => {
    setEditStatus(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setEditStatus(false);
  };

  const validate = () => {
      const newErrors = {}
  
      // Check required fields with null/undefined checks
      if (!formData.name || !formData.name.trim()) newErrors.name = "Staff Name is required"
      if (!formData.email || !formData.email.trim()) newErrors.email = "Email is required"
      if ((!formData.password || !formData.password.trim())) newErrors.password = "Password is required"
      if (!formData.address || !formData.address.trim()) newErrors.address = "Address is required"
      if (!formData.phoneNumber || !formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required"
      if (!formData.dob) newErrors.dob = "Date of Birth is required"
      if (!formData.joinedDate) newErrors.joinedDate = "Joined Date is required"
  
      // Email validation - only if email exists
      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
      }
  
      // Phone validation - only if phone exists
      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        const phoneRegex = /^\d{10,}$/
        if (!phoneRegex.test(formData.phoneNumber.replace(/[^0-9]/g, ""))) {
          newErrors.phoneNumber = "Please enter a valid phone number"
        }
      }
  
      // Date validation - only if both dates exist
      if (formData.dob && formData.joinedDate) {
        const dobDate = dayjs(formData.dob)
        const joinedDate = dayjs(formData.joinedDate)
  
        if (dobDate.isAfter(joinedDate)) {
          newErrors.joinedDate = "Joined Date cannot be before Date of Birth"
        }
  
        if (dobDate.isAfter(dayjs())) {
          newErrors.dob = "Date of Birth cannot be in the future"
        }
      }
  
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
    // Handle form submission
  const handleSave = async (e) => {
      e.preventDefault()
  
      if (!validate()) {
        console.error("Validation failed", formData)
        return
      }
  
      console.log("Form Submitted:", formData)
  
      const url = `http://localhost:8383/staff/edit/${id}`
  
      const method = id ? "PUT" : "POST"
      try {
        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            "otmm-api-key": "KoaderMasters",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
  
        console.log("Response:", response.data)
        console.log(formData)
        setEditStatus(false)
        refetchUserDatas()
      } catch (error) {
        console.error("Error submitting form:", error.message)
      }
    }
  return (
    <>
      <div className="infoContainer">
        <div className="ImageContainer">
          <div className="img">
            <img src={userData.image} alt="" width={150} height={150} />
          </div>
          <div className="staffName">
            <div className="flex">
              <h2>{userData.name}</h2>
              <p>/ {userData?.UserType?.name}</p>
            </div>

            <div>
              <button
                className="createNewButton flexRow"
                onClick={handleEditProfile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11.5 2C10.0413 2 8.64236 2.57946 7.61091 3.61091C6.57946 4.64236 6 6.04131 6 7.5C6 8.95869 6.57946 10.3576 7.61091 11.3891C8.64236 12.4205 10.0413 13 11.5 13C12.9587 13 14.3576 12.4205 15.3891 11.3891C16.4205 10.3576 17 8.95869 17 7.5C17 6.04131 16.4205 4.64236 15.3891 3.61091C14.3576 2.57946 12.9587 2 11.5 2ZM19.5 12.75V14.126C20.215 14.31 20.852 14.686 21.354 15.198L22.546 14.509L23.546 16.241L22.355 16.929C22.5497 17.6297 22.5497 18.3703 22.355 19.071L23.546 19.759L22.546 21.491L21.354 20.802C20.8449 21.3212 20.2039 21.6918 19.5 21.874V23.25H17.5V21.874C16.7961 21.6918 16.1551 21.3212 15.646 20.802L14.453 21.491L13.453 19.759L14.645 19.071C14.4503 18.3703 14.4503 17.6297 14.645 16.929L13.453 16.241L14.453 14.509L15.646 15.197C16.1552 14.6782 16.7962 14.3079 17.5 14.126V12.75H19.5ZM16.749 17.033C16.5852 17.329 16.4992 17.6617 16.499 18C16.499 18.35 16.59 18.68 16.749 18.967L16.785 19.03C16.9627 19.3262 17.214 19.5713 17.5146 19.7414C17.8151 19.9116 18.1546 20.001 18.5 20.001C18.8454 20.001 19.1849 19.9116 19.4854 19.7414C19.786 19.5713 20.0373 19.3262 20.215 19.03L20.251 18.967C20.41 18.68 20.5 18.351 20.5 18C20.5 17.65 20.41 17.32 20.251 17.033L20.214 16.97C20.0363 16.6741 19.7849 16.4292 19.4845 16.2592C19.184 16.0892 18.8447 15.9998 18.4995 15.9998C18.1543 15.9998 17.815 16.0892 17.5145 16.2592C17.2141 16.4292 16.9627 16.6741 16.785 16.97L16.749 17.033ZM13.062 14C12.2075 15.1584 11.7476 16.5606 11.75 18C11.7476 19.4394 12.2075 20.8416 13.062 22H2V20C2 18.4087 2.63214 16.8826 3.75736 15.7574C4.88258 14.6321 6.4087 14 8 14H13.062Z"
                    fill="currentColor"
                  />
                </svg>
                <p> Edit your Profile</p>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="infoHeader">Personal Information</h3>
          <div className="detail">
            <h4>Position</h4>
            <p className="colon">:</p>
            <p>{userData.position}</p>
            <h4>Team</h4>
            <p className="colon">:</p>
            <p>{userData?.Team?.name}</p>
            <h4>Email</h4>
            <p className="colon">:</p>
            <p>{userData.email}</p>
            <h4>Phone Number</h4>
            <p className="colon">:</p>
            <p>{userData.phoneNumber}</p>
            <h4>Address</h4>
            <p className="colon">:</p>
            <p>{userData.address}</p>
            <h4>Date of Birth</h4>
            <p className="colon">:</p>
            <p>{dayjs(userData.dob).format("DD/MM/YYYY")}</p>
            <h4>Joined Date</h4>
            <p className="colon">:</p>
            <p>{dayjs(userData.joinedDate).format("DD/MM/YYYY")}</p>
          </div>
        </div>
      </div>
      {editStatus && (
        <>
          <div className="bgBlur"></div>
          <div className="entryContainer StaffentryContainer">
            <div className="modelTitle">
              <h4>Edit Profile</h4>
            </div>
            <div className="modelContent">
              <form onSubmit={handleSave}>
                <div className="scroll">
                  <div className="formGroup modelTwoColumn">
                    <div>
                      {/* name */}
                      <div>
                        <label htmlFor="name" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Staff Name</p>
                          </div>
                          <div className="instruction">
                            {errors.name && (
                              <small className="error">{errors.name}</small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter Staff Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Phone</p>
                          </div>
                          <div className="instruction">
                            {errors.phoneNumber && (
                              <small className="error">
                                {errors.phoneNumber}
                              </small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter Staff Phone"
                          />
                        </div>
                      </div>

                      {/* address */}
                      <div>
                        <label htmlFor="address" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Address</p>
                          </div>
                          <div className="instruction">
                            {errors.address && (
                              <small className="error">{errors.address}</small>
                            )}
                          </div>
                        </label>

                        <div className="flexRow inputRow">
                          <textarea
                            name="address"
                            id="address"
                            className="input"
                            onChange={handleChange}
                            value={formData.address}
                          ></textarea>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dob" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>DOB</p>
                          </div>
                          <div className="instruction">
                            {errors.dob && (
                              <small className="error">{errors.dob}</small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="date"
                            name="dob"
                            value={
                              formData.dob
                                ? dayjs(userData.dob).format("YYYY-MM-DD")
                                : ""
                            }
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter Staff DOB"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="joinedDate" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Joined Date</p>
                          </div>
                          <div className="instruction">
                            {errors.joinedDate && (
                              <small className="error">
                                {errors.joinedDate}
                              </small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow">
                          <input
                            type="date"
                            name="joinedDate"
                            value={
                              userData.joinedDate
                                ? dayjs(formData.joinedDate).format(
                                    "YYYY-MM-DD"
                                  )
                                : ""
                            }
                            onChange={handleChange}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="image" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Profile Photo</p>
                          </div>
                          <div className="instruction">
                            {errors.image && (
                              <small className="error">{errors.image}</small>
                            )}
                          </div>
                        </label>
                        <div className=" inputRow">
                          <ImageUpload
                            handleFileChange={handleFileChange}
                            value={formData.image}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Staff Email</p>
                          </div>
                          <div className="instruction">
                            {errors.email && (
                              <small className="error">{errors.email}</small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="example@gmail.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Staff Password</p>
                          </div>
                          <div className="instruction">
                            {errors.password && (
                              <small className="error">{errors.password}</small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter Staff Password"
                            // required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="btnGp">
                  {/* <hr /> */}
                  <div className="btnContainer">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancelBtn"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="saveBtn">
                      {id ? "Update" : "Register"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
