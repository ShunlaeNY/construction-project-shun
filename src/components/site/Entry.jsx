import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCRUD } from "../HOC/UseCRUD";
import { useFetchData } from "../HOC/UseFetchData";
import "../../assets/styles/list.scss";
import "../menu/staff/entry.scss";
import "../../assets/styles/entry.scss";
import "../site/entry.scss";
import ImageUpload from "../HOC/inputBoxes/ImageUpload";
import Checkbox from "../HOC/inputBoxes/Checkbox";
import MapComponent from "../HOC/inputBoxes/MapComponent";
export default function Entry({
  showCreateModelBox,
  setShowCreateModelBox,
  onSuccess,
}) {
  const {
    handleDelete,
    handleCreate,
    handleEdit,
    loading: crudLoading,
    error: crudError,
    deleteStatus,
    refetch,
  } = useCRUD();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "no scheduled",
    staffId: "",
    businesspartnerId: "",
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { data: businesssPartnerList } = useFetchData(
    "http://localhost:8383/businesspartner/list",
    deleteStatus
  );

  const { data: managerList } = useFetchData(
    "http://localhost:8383/staff/list",
    deleteStatus
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Site Name is required";
    if (!formData.businesspartnerId)
      newErrors.businesspartnerId = "Please select Partner";
    if (!formData.staffId) newErrors.staffId = "Please select   Manager";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.status)
      newErrors.status = "Please select a Construction Status";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      dayjs(formData.startDate).isAfter(dayjs(formData.endDate))
    ) {
      newErrors.endDate = "End Date must be after Start Date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");

    if (!validate()) {
      console.error("Validation failed", formData);
      return;
    }

    console.log("Form is valid, preparing request...");

    const url = "http://localhost:8383/site/add";
    const method = "POST";
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "otmm-api-key": "KoaderMasters",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);

      if (onSuccess) {
        onSuccess();
      }

      setShowCreateModelBox(false);
      // navigate(-1);

      // navigate("/site");
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        console.error(
          "Server Response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No Response from Server:", error.request);
      } else {
        console.error("Request Setup Error:", error.message);
      }
    }
  };

  // Handle form clear/reset
  const handleClear = () => {
    setFormData({
      name: "",
      color: "#FF4400",
    });
  };
  const handleCancel = () => {
    handleClear();
    setShowCreateModelBox(false);
  };
  return (
    <>
      <div className="bgBlur">
        <div className=" entryContainer BPentryContainer ">
          <div className="modelTitle">
            <h4>Create New Site</h4>
          </div>
          <div className="modelContent">
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <div className="formTwoCol modelTwoColumn">
                  <div>
                    <div>
                      <label htmlFor="name" className="inputLabel">
                        <div className="flexRow">
                          <small>[Required]</small>
                          <p>Site Name</p>
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
                          required
                          className="input"
                          placeholder="Enter Site Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="businessPartner" className="inputLabel">
                        <div className="flexRow">
                          <small>[Required]</small>
                          <p>Business Partner</p>
                        </div>
                        <div className="instruction">
                          {errors.businesspartnerId && (
                            <small className="error">
                              {errors.businesspartnerId}
                            </small>
                          )}
                        </div>
                      </label>
                      <div className="flexRow inputRow">
                        <select
                          onChange={handleChange}
                          value={formData.businesspartnerId}
                          name="businesspartnerId"
                          id="businesspartnerId"
                          className="input"
                          required
                        >
                          <option value="" disabled>
                            --- Select Partner ---
                          </option>
                          {businesssPartnerList.map((option, index) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="siteManager" className="inputLabel">
                        <div className="flexRow">
                          <small>[Required]</small>
                          <p>Site Manager</p>
                        </div>
                        <div className="instruction">
                          {errors.staffId && (
                            <small className="error">{errors.staffId}</small>
                          )}
                        </div>
                      </label>
                      <div className="flexRow inputRow">
                        <select
                          onChange={handleChange}
                          value={formData.staffId}
                          name="staffId"
                          id="staffId"
                          className="input"
                          required
                        >
                          <option value="" disabled>
                            --- Select Manager ---
                          </option>

                          {managerList &&
                            managerList
                              .filter((option) => option.position === 'manager')
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                        </select>
                      </div>

                    </div>
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
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="input"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label
                        htmlFor="constructionStatus"
                        className="inputLabel"
                      >
                        <div className="flexRow">
                          <small>[Required]</small>
                          <p>Construction Status</p>
                        </div>
                        <div className="instruction"></div>
                      </label>
                      <div className="flexRow inputRow">
                        <select
                          name="status"
                          id="status"
                          onChange={handleChange}
                          value={formData.status}
                          className="input"
                          required
                        >
                          <option value="">
                            --- Select Schedule ---
                          </option>
                          <option value="no scheduled">
                            &#x1F7E5; Not Scheduled (By Default)
                          </option>
                          {/* <option value="before construction">
                            &#x1F7E6; Before Construction
                          </option> */}
                          <option value="under construction">
                            &#x1F7E9; Under Construction
                          </option>
                          <option value="completed">&#x1F7E7; Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="checkBoxContaier">
                      <label htmlFor="name" className="inputLabel">
                        <div className="flexRow">
                          <p style={{ color: "#f27d14" }}>Schedule</p>
                        </div>
                      </label>
                      <div>
                        <label htmlFor="joinedDate" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>Start Date</p>
                          </div>
                          <div className="instruction">
                            {errors.startDate && (
                              <small className="error">
                                {errors.startDate}
                              </small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={
                              formData.startDate
                                ? dayjs(formData.startDate).format("YYYY-MM-DD")
                                : ""
                            }
                            onChange={handleChange}
                            required
                            className="input"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="endDate" className="inputLabel">
                          <div className="flexRow">
                            <small>[Required]</small>
                            <p>End Date</p>
                          </div>
                          <div className="instruction">
                            {errors.endDate && (
                              <small className="error">{errors.endDate}</small>
                            )}
                          </div>
                        </label>
                        <div className="flexRow inputRow">
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={
                              formData.endDate
                                ? dayjs(formData.endDate).format("YYYY-MM-DD")
                                : ""
                            }
                            onChange={handleChange}
                            required
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="btnGp">
                {/* <hr /> */}
                <div className="btnContainer2">
                  <div className="hint">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4ZM12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM13 15H11V17H13V15ZM11 13H13L13.5 7H10.5L11 13Z"
                        fill="#FFA629"
                      />
                    </svg>
                    Once you complete registration, you can change details.
                  </div>
                  <div className="flexRow">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancelBtn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="saveBtn"
                      onClick={handleSubmit}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
