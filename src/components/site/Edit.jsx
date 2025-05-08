import React, { useState, useEffect, useRef } from "react";
import { useCRUD } from "../HOC/UseCRUD";
import "./edit.scss";
import "../../assets/styles/entry.scss";
import GoogleMapComoponent from "../GoogleMapComponent";
import ClickableMap from "../ClickableMap";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../HOC/UseFetchData";
import dayjs from "dayjs";
import axios from "axios";
import OperationForm from "./OperationForm";
function Detail({ onCancel, siteId }) {
  const { data: siteData } = useFetchData(
    `http://localhost:8383/site/getbyid/${siteId}`
  );

  const forStartDate = new Date(siteData.startDate);
  const forEndDate = new Date(siteData.endDate);
  return (
    <div className="detailTab">
      <div className="detailTabContent">
        <h2>Details</h2>
        <div>
          <div className="detailTabContentItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M16.0802 17.7004L18.5547 15.2259L25.55 22.2213L23.0755 24.6958L16.0802 17.7004ZM20.4167 11.6664C22.6683 11.6664 24.5 9.83477 24.5 7.58311C24.5 6.90644 24.3133 6.27644 24.0217 5.71644L20.8717 8.86644L19.1333 7.12811L22.2833 3.97811C21.7233 3.68644 21.0933 3.49977 20.4167 3.49977C18.165 3.49977 16.3333 5.33144 16.3333 7.58311C16.3333 8.06144 16.4267 8.51644 16.5783 8.93644L14.42 11.0948L12.3433 9.01811L13.1717 8.18977L11.5267 6.54477L14 4.07144C13.3438 3.416 12.4542 3.04785 11.5267 3.04785C10.5992 3.04785 9.7096 3.416 9.05335 4.07144L4.92335 8.20144L6.56835 9.84644H3.27835L2.45001 10.6748L6.58001 14.8048L7.40835 13.9764V10.6748L9.05335 12.3198L9.88168 11.4914L11.9583 13.5681L3.31335 22.2131L5.78668 24.6864L19.0633 11.4214C19.4833 11.5731 19.9383 11.6664 20.4167 11.6664Z"
                fill="#F27D14"
              />
            </svg>
            <p>{siteData.name}</p>
          </div>

          <div className="detailTabContentItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              viewBox="0 0 22 26"
              fill="none"
            >
              <path
                d="M11 13.1663C13.7953 13.1663 16.3375 13.976 18.2077 15.117C19.141 15.6863 19.939 16.3583 20.5153 17.0887C21.0823 17.8062 21.5 18.6648 21.5 19.583C21.5 20.5688 21.0205 21.3458 20.3298 21.9C19.6765 22.425 18.8143 22.7727 17.8985 23.0153C16.0575 23.5018 13.6005 23.6663 11 23.6663C8.3995 23.6663 5.9425 23.503 4.1015 23.0153C3.18567 22.7727 2.3235 22.425 1.67017 21.9C0.978333 21.3447 0.5 20.5688 0.5 19.583C0.5 18.6648 0.917667 17.8062 1.48467 17.0875C2.061 16.3583 2.85783 15.6875 3.79233 15.1158C5.6625 13.9772 8.20583 13.1663 11 13.1663ZM11 0.333008C12.5471 0.333008 14.0308 0.947589 15.1248 2.04155C16.2188 3.13551 16.8333 4.61924 16.8333 6.16634C16.8333 7.71344 16.2188 9.19717 15.1248 10.2911C14.0308 11.3851 12.5471 11.9997 11 11.9997C9.4529 11.9997 7.96917 11.3851 6.87521 10.2911C5.78125 9.19717 5.16667 7.71344 5.16667 6.16634C5.16667 4.61924 5.78125 3.13551 6.87521 2.04155C7.96917 0.947589 9.4529 0.333008 11 0.333008Z"
                fill="#F27D14"
              />
            </svg>
            {siteData.Businesspartner ? (
              <p>{siteData.Businesspartner.name}</p>
            ) : (
              <p>Loading Business Partner...</p>
            )}
          </div>
          <div className="detailTabContentItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M15 18.75C9.475 18.75 5 20.9875 5 23.75V26.25H25V23.75C25 20.9875 20.525 18.75 15 18.75ZM10 11.25C10 12.5761 10.5268 13.8479 11.4645 14.7855C12.4021 15.7232 13.6739 16.25 15 16.25C16.3261 16.25 17.5979 15.7232 18.5355 14.7855C19.4732 13.8479 20 12.5761 20 11.25M14.375 2.5C14 2.5 13.75 2.7625 13.75 3.125V6.875H12.5V3.75C12.5 3.75 9.6875 4.825 9.6875 8.4375C9.6875 8.4375 8.75 8.6125 8.75 10H21.25C21.1875 8.6125 20.3125 8.4375 20.3125 8.4375C20.3125 4.825 17.5 3.75 17.5 3.75V6.875H16.25V3.125C16.25 2.7625 16.0125 2.5 15.625 2.5H14.375Z"
                fill="#F27D14"
              />
            </svg>
            {siteData.Businesspartner ? (
              <p>{siteData.Staff.name}</p>
            ) : (
              <p>Loading Site Manager ...</p>
            )}
          </div>
          <div className="detailTabContentItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M9.6875 3.125C9.6875 2.87636 9.58873 2.6379 9.41292 2.46209C9.2371 2.28627 8.99865 2.1875 8.75 2.1875C8.50136 2.1875 8.26291 2.28627 8.08709 2.46209C7.91128 2.6379 7.8125 2.87636 7.8125 3.125V5.1C6.0125 5.24375 4.8325 5.59625 3.965 6.465C3.09625 7.3325 2.74375 8.51375 2.59875 10.3125H27.4013C27.2563 8.5125 26.9038 7.3325 26.035 6.465C25.1675 5.59625 23.9863 5.24375 22.1875 5.09875V3.125C22.1875 2.87636 22.0887 2.6379 21.9129 2.46209C21.7371 2.28627 21.4986 2.1875 21.25 2.1875C21.0014 2.1875 20.7629 2.28627 20.5871 2.46209C20.4113 2.6379 20.3125 2.87636 20.3125 3.125V5.01625C19.4813 5 18.5488 5 17.5 5H12.5C11.4513 5 10.5188 5 9.6875 5.01625V3.125Z"
                fill="#F27D14"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 15C2.5 13.9513 2.5 13.0188 2.51625 12.1875H27.4837C27.5 13.0188 27.5 13.9513 27.5 15V17.5C27.5 22.2137 27.5 24.5712 26.035 26.035C24.57 27.4987 22.2137 27.5 17.5 27.5H12.5C7.78625 27.5 5.42875 27.5 3.965 26.035C2.50125 24.57 2.5 22.2137 2.5 17.5V15ZM21.25 17.5C21.5815 17.5 21.8995 17.3683 22.1339 17.1339C22.3683 16.8995 22.5 16.5815 22.5 16.25C22.5 15.9185 22.3683 15.6005 22.1339 15.3661C21.8995 15.1317 21.5815 15 21.25 15C20.9185 15 20.6005 15.1317 20.3661 15.3661C20.1317 15.6005 20 15.9185 20 16.25C20 16.5815 20.1317 16.8995 20.3661 17.1339C20.6005 17.3683 20.9185 17.5 21.25 17.5ZM21.25 22.5C21.5815 22.5 21.8995 22.3683 22.1339 22.1339C22.3683 21.8995 22.5 21.5815 22.5 21.25C22.5 20.9185 22.3683 20.6005 22.1339 20.3661C21.8995 20.1317 21.5815 20 21.25 20C20.9185 20 20.6005 20.1317 20.3661 20.3661C20.1317 20.6005 20 20.9185 20 21.25C20 21.5815 20.1317 21.8995 20.3661 22.1339C20.6005 22.3683 20.9185 22.5 21.25 22.5ZM16.25 16.25C16.25 16.5815 16.1183 16.8995 15.8839 17.1339C15.6495 17.3683 15.3315 17.5 15 17.5C14.6685 17.5 14.3505 17.3683 14.1161 17.1339C13.8817 16.8995 13.75 16.5815 13.75 16.25C13.75 15.9185 13.8817 15.6005 14.1161 15.3661C14.3505 15.1317 14.6685 15 15 15C15.3315 15 15.6495 15.1317 15.8839 15.3661C16.1183 15.6005 16.25 15.9185 16.25 16.25ZM16.25 21.25C16.25 21.5815 16.1183 21.8995 15.8839 22.1339C15.6495 22.3683 15.3315 22.5 15 22.5C14.6685 22.5 14.3505 22.3683 14.1161 22.1339C13.8817 21.8995 13.75 21.5815 13.75 21.25C13.75 20.9185 13.8817 20.6005 14.1161 20.3661C14.3505 20.1317 14.6685 20 15 20C15.3315 20 15.6495 20.1317 15.8839 20.3661C16.1183 20.6005 16.25 20.9185 16.25 21.25ZM8.75 17.5C9.08152 17.5 9.39946 17.3683 9.63388 17.1339C9.8683 16.8995 10 16.5815 10 16.25C10 15.9185 9.8683 15.6005 9.63388 15.3661C9.39946 15.1317 9.08152 15 8.75 15C8.41848 15 8.10054 15.1317 7.86612 15.3661C7.6317 15.6005 7.5 15.9185 7.5 16.25C7.5 16.5815 7.6317 16.8995 7.86612 17.1339C8.10054 17.3683 8.41848 17.5 8.75 17.5ZM8.75 22.5C9.08152 22.5 9.39946 22.3683 9.63388 22.1339C9.8683 21.8995 10 21.5815 10 21.25C10 20.9185 9.8683 20.6005 9.63388 20.3661C9.39946 20.1317 9.08152 20 8.75 20C8.41848 20 8.10054 20.1317 7.86612 20.3661C7.6317 20.6005 7.5 20.9185 7.5 21.25C7.5 21.5815 7.6317 21.8995 7.86612 22.1339C8.10054 22.3683 8.41848 22.5 8.75 22.5Z"
                fill="#F27D14"
              />
            </svg>{" "}
            <p>
              {forStartDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              ~
              {forEndDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="detailTabContentItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              viewBox="0 0 20 28"
              fill="none"
            >
              <path
                d="M10 13.3C9.0528 13.3 8.14439 12.9313 7.47462 12.2749C6.80485 11.6185 6.42857 10.7283 6.42857 9.8C6.42857 8.87174 6.80485 7.9815 7.47462 7.32513C8.14439 6.66875 9.0528 6.3 10 6.3C10.9472 6.3 11.8556 6.66875 12.5254 7.32513C13.1952 7.9815 13.5714 8.87174 13.5714 9.8C13.5714 10.2596 13.4791 10.7148 13.2996 11.1394C13.1201 11.564 12.857 11.9499 12.5254 12.2749C12.1937 12.5999 11.8 12.8577 11.3667 13.0336C10.9334 13.2095 10.469 13.3 10 13.3ZM10 0C7.34784 0 4.8043 1.0325 2.92893 2.87035C1.05357 4.70821 0 7.20088 0 9.8C0 17.15 10 28 10 28C10 28 20 17.15 20 9.8C20 7.20088 18.9464 4.70821 17.0711 2.87035C15.1957 1.0325 12.6522 0 10 0Z"
                fill="#F27D14"
              />
            </svg>
            <p>{siteData.address}</p>
          </div>
        </div>
      </div>
      <div className="detailTabMapContainer">
        <div>
          <GoogleMapComoponent />
        </div>
        {/* <button onClick={onCancel} className="saveBtn ">
          Close
        </button> */}
      </div>
    </div>
  );
}

function EditSite({ onCancel, onSuccess, siteId }) {
  console.log("SITE EDIT ID", siteId);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "",
    staffId: "",
    businesspartnerId: "",
    startDate: "",
    endDate: "",
  });
  const { data: siteData } = useFetchData(
    `http://localhost:8383/site/getbyid/${siteId}`
  );

  useEffect(() => {
    if (siteData) {
      setFormData(siteData);
    }
  }, [siteData]);
  const { data: businesssPartnerList } = useFetchData(
    "http://localhost:8383/businesspartner/list"
  );
  const { data: managerList } = useFetchData(
    "http://localhost:8383/staff/list"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const {
    handleDelete,
    handleCreate,
    handleEdit,
    loading: crudLoading,
    error: crudError,
    deleteStatus,
    refetch,
  } = useCRUD();
  const handleDeleteData = async (id) => {
    const url = `http://localhost:8383/site/delete`;
    await handleDelete(url, id);
    if (onSuccess) {
      onSuccess();
    }
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Edit Form Submitted:", formData);

    const url = `http://localhost:8383/site/edit/${siteId}`;

    const method = "PUT";
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
      });

      console.log("Response:", response.data);
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="editSiteTab">
      <h2>Edit Site</h2>
      <div className="editSiteTabContent">
        <div>
          <div>
            <label htmlFor="name" className="inputLabel">
              <div className="flexRow">
                <small>[Required]</small>
                <p>Site Name</p>
              </div>
              <div className="instruction">
                {/* <small>Please Enter Site Name</small> */}
              </div>
            </label>
            <div className="flexRow inputRow">
              <input
                type="text"
                name="name"
                required
                className="input"
                placeholder="Enter Site Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="partner" className="inputLabel">
              <div className="flexRow">
                <small>[Required]</small>
                <p>Business Partner</p>
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
            <label htmlFor="manager" className="inputLabel">
              <div className="flexRow">
                <small>[Required]</small>
                <p>Site Manager</p>
              </div>
            </label>
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
                  .filter((option) => option.position === "manager")
                  .map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
            </select>
          </div>
          <div>
            <label htmlFor="address" className="inputLabel">
              <div className="flexRow">
                <small>[Required]</small>
                <p>Address</p>
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
              {/* <ClickableMap /> */}
            </div>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="construction" className="inputLabel">
              <div className="flexRow">
                <small>[Required]</small>
                <p>Construction Status</p>
              </div>
            </label>
            <select
              name="status"
              id="status"
              onChange={handleChange}
              value={formData.status}
              className="input"
              required
            >
              <option value="">--- Select Schedule ---</option>
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
          <div className="scheduleDiv">
            <label htmlFor="name" className="inputLabel">
              <p style={{ color: "#f27d14" }}>Schedule</p>
            </label>
            <div>
              <label htmlFor="joinedDate" className="inputLabel">
                <div className="flexRow">
                  <small>[Required]</small>
                  <p>Start Date</p>
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
              <label htmlFor="joinedDate" className="inputLabel">
                <div className="flexRow">
                  <small>[Required]</small>
                  <p>End Date</p>
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
      <div className="editBtnContainer">
        <svg className="deleteBtn" style={{marginBottom: "15px"}}
            onClick={() => handleDeleteData(siteId)}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M4.6875 7.5H8.4375V5.15625C8.4375 4.12207 9.27832 3.28125 10.3125 3.28125H19.6875C20.7217 3.28125 21.5625 4.12207 21.5625 5.15625V7.5H25.3125C25.8311 7.5 26.25 7.91895 26.25 8.4375V9.375C26.25 9.50391 26.1445 9.60938 26.0156 9.60938H24.2461L23.5225 24.9316C23.4756 25.9307 22.6494 26.7188 21.6504 26.7188H8.34961C7.34766 26.7188 6.52441 25.9336 6.47754 24.9316L5.75391 9.60938H3.98438C3.85547 9.60938 3.75 9.50391 3.75 9.375V8.4375C3.75 7.91895 4.16895 7.5 4.6875 7.5ZM10.5469 7.5H19.4531V5.39062H10.5469V7.5Z"
              fill="#F24822"
            />
          </svg>
        <div className="btnWrapper" style={{marginTop:"5px"}}>
          <button onClick={onCancel} className="cancelBtn">
            Cancel
          </button>
          <button type="submit" className="saveBtn">
            Update
          </button>
        </div>
      </div>
    </form>
  );
}

function EditSchedule({ siteId }) {
  const [operationForm, setOperationForm] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const calendarRef = useRef(null);

  const handleOpenOperation = () => setOperationForm(true);
  const handleCloseOperation = () => setOperationForm(false);

  // Fetch site data
  const { data: siteData, refetch: refetchSiteData } = useFetchData(
    siteId ? `http://localhost:8383/site/getbyid/${siteId}` : null
  );

  // Fetch site operations
  const { data: siteoperationData, refetch: refetchSiteoperationData } =
    useFetchData(
      siteId
        ? `http://localhost:8383/siteoperation/getbysiteid/${siteId}`
        : null
    );

  const operationtypesId = siteoperationData?.[0]?.operationtypesId;

  // Fetch operation type data
  const { data: operationData } = useFetchData(
    operationtypesId
      ? `http://localhost:8383/operationtypes/getbyid/${operationtypesId}`
      : null
  );

  // Generate calendar days for the current month
  useEffect(() => {
    if (siteData?.startDate && siteData?.endDate) {
      const siteStart = dayjs(siteData.startDate);
      const siteEnd = dayjs(siteData.endDate);

      // Ensure currentDate is within the site’s date range
      if (currentDate.isBefore(siteStart) || currentDate.isAfter(siteEnd)) {
        setCurrentDate(siteStart);
        return;
      }

      const monthStart = currentDate.startOf("month");
      const monthEnd = currentDate.endOf("month");

      const displayStart = monthStart.isBefore(siteStart)
        ? siteStart
        : monthStart;
      const displayEnd = monthEnd.isAfter(siteEnd) ? siteEnd : monthEnd;

      let days = [];
      let date = displayStart;

      while (date.isBefore(displayEnd) || date.isSame(displayEnd, "day")) {
        days.push({
          date: date,
          dayOfMonth: date.date(),
          weekday: date.format("dd").charAt(0),
          isToday: date.isSame(dayjs(), "day"),
        });
        date = date.add(1, "day");
      }

      setCalendarDays(days);
    }
  }, [siteData, currentDate]);

  // Format month-year for display
  const formatDateRange = () => {
    return calendarDays.length > 0
      ? currentDate.format("MMMM YYYY")
      : "No dates available";
  };

  // Adjust date range for navigation
  const adjustDate = (direction) => {
    if (direction === "prev") {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else if (direction === "next") {
      setCurrentDate(currentDate.add(1, "month"));
    } else if (direction === "today") {
      const today = dayjs();
      if (siteData?.startDate && siteData?.endDate) {
        const siteStart = dayjs(siteData.startDate);
        const siteEnd = dayjs(siteData.endDate);
        if (today.isBefore(siteStart)) {
          setCurrentDate(siteStart);
        } else if (today.isAfter(siteEnd)) {
          setCurrentDate(siteEnd);
        } else {
          setCurrentDate(today);
        }
      } else {
        setCurrentDate(today);
      }
    }
  };

  // Check if navigation buttons should be disabled
  const canGoToPrev = () => {
    if (!siteData?.startDate) return false;
    return currentDate
      .startOf("month")
      .isAfter(dayjs(siteData.startDate).startOf("month"));
  };

  const canGoToNext = () => {
    if (!siteData?.endDate) return false;
    return currentDate
      .startOf("month")
      .isBefore(dayjs(siteData.endDate).startOf("month"));
  };
  //refresh
  const refetchAllData = () => {
    refetchSiteData();
    refetchSiteoperationData();
  };

  return (
    <div className="scheduleEdit">
      <h2>Schedule</h2>

      {/* Date Navigation */}
      <div className="dateNavigateDiv">
        <div className="dateNavigation">
          <button
            className="nav-btn"
            onClick={() => adjustDate("prev")}
            disabled={!canGoToPrev()}
          >
            &lt;
          </button>
          <div className="selectedDate">{formatDateRange()}</div>
          <button
            className="nav-btn"
            onClick={() => adjustDate("next")}
            disabled={!canGoToNext()}
          >
            &gt;
          </button>
        </div>
        <button className="todayBtn" onClick={() => adjustDate("today")}>
          Today
        </button>
      </div>

      {/* Calendar Timeline */}
      <div className="timeline">
        <div className="calendarWrapper" ref={calendarRef}>
          <div className="calendarTimeline2">
            <div className="calendar-days-container2">
              <div className="calendar-days2">
                <div className="days-header2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`day-header ${day.isToday ? "today" : ""}`}
                    >
                      {day.weekday}
                    </div>
                  ))}
                </div>
                <div className="days-grid2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`day-cell ${day.isToday ? "today" : ""}`}
                    >
                      {day.dayOfMonth}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Operations Display */}
        <div className="operations-container">
          {siteoperationData?.map((operation, index) => {
            const opStart = dayjs(operation.startDate);
            const opEnd = dayjs(operation.endDate);
            const monthStart = currentDate.startOf("month");
            const monthEnd = currentDate.endOf("month");

            if (opEnd.isBefore(monthStart) || opStart.isAfter(monthEnd))
              return null;

            const displayStart = opStart.isBefore(monthStart)
              ? monthStart
              : opStart;
            const displayEnd = opEnd.isAfter(monthEnd) ? monthEnd : opEnd;

            const startIndex = calendarDays.findIndex((d) =>
              d.date.isSame(displayStart, "day")
            );
            const endIndex = calendarDays.findIndex((d) =>
              d.date.isSame(displayEnd, "day")
            );

            if (startIndex === -1 || endIndex === -1) return null;
            // console.log(operationData.color);

            return (
              <div
                key={index}
                className="operation-bar"
                style={{
                  gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
                  backgroundColor:
                    operation.Operationtype?.color ||
                    (index % 2 === 0 ? "#ff9800" : "#4caf50"),
                }}
              >
                <p>
                  {operation.Operationtype?.name || `Operation ${index + 1}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Operation Button */}
      <div  onClick={handleOpenOperation} className="addSiteOperation">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect width="50" height="50" rx="25" fill="#F27D14"/>
          <path d="M39 16.2499V30.2499H37.25V22.4706L28.5 26.8593V28.4999H21.5V26.8593L12.75 22.4706V31.9999H28.5V33.7499H11V16.2499H19.75V14.4999C19.75 14.2538 19.7956 14.026 19.8867 13.8163C19.9779 13.6067 20.1009 13.4244 20.2559 13.2694C20.4108 13.1145 20.5977 12.9869 20.8164 12.8866C21.0352 12.7864 21.263 12.7408 21.5 12.7499H28.5C28.7461 12.7499 28.974 12.7955 29.1836 12.8866C29.3932 12.9778 29.5755 13.1008 29.7305 13.2558C29.8854 13.4107 30.013 13.5976 30.1133 13.8163C30.2135 14.0351 30.2591 14.2629 30.25 14.4999V16.2499H39ZM21.5 16.2499H28.5V14.4999H21.5V16.2499ZM26.75 24.9999H23.25V26.7499H26.75V24.9999ZM37.25 20.5292V17.9999H12.75V20.5292L21.5 24.8905V23.2499H28.5V24.8905L37.25 20.5292ZM35.5 31.9999H39V33.7499H35.5V37.2499H33.75V33.7499H30.25V31.9999H33.75V28.4999H35.5V31.9999Z" fill="white"/>
        </svg>        
      </div>

      {operationForm && (
        <OperationForm
          onCancel={handleCloseOperation}
          siteId={siteId}
          onSuccess={refetchAllData}
        />
      )}
    </div>
  );
}

const tabs = [
  {
    id: "detail",
    label: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
        >
          <path
            d="M17.7083 31.2503H32.2917M17.7083 37.5003H25M40.625 4.16699H11.4583C10.9058 4.16699 10.3759 4.38649 9.98519 4.77719C9.59449 5.16789 9.375 5.69779 9.375 6.25033V43.7503C9.375 44.3029 9.59449 44.8328 9.98519 45.2235C10.3759 45.6142 10.9058 45.8337 11.4583 45.8337H40.625C41.1775 45.8337 41.7074 45.6142 42.0981 45.2235C42.4888 44.8328 42.7083 44.3029 42.7083 43.7503V6.25033C42.7083 5.69779 42.4888 5.16789 42.0981 4.77719C41.7074 4.38649 41.1775 4.16699 40.625 4.16699Z"
            stroke="#FFA629"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.7083 12.5H32.2917V22.9167H17.7083V12.5Z"
            stroke="#FFA629"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <small>Detail</small>
      </>
    ),
    content: <Detail />,
  },
  {
    id: "editSite",
    label: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
        >
          <path
            d="M16.0417 16.042H13.75C12.5344 16.042 11.3686 16.5249 10.5091 17.3844C9.64954 18.244 9.16666 19.4098 9.16666 20.6253V41.2503C9.16666 42.4659 9.64954 43.6317 10.5091 44.4912C11.3686 45.3508 12.5344 45.8337 13.75 45.8337H34.375C35.5906 45.8337 36.7564 45.3508 37.6159 44.4912C38.4754 43.6317 38.9583 42.4659 38.9583 41.2503V38.9587"
            stroke="#FFA629"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36.6667 11.4586L43.5417 18.3336M46.7156 15.0909C47.6182 14.1883 48.1252 12.9642 48.1252 11.6877C48.1252 10.4113 47.6182 9.18719 46.7156 8.28462C45.8131 7.38206 44.5889 6.875 43.3125 6.875C42.0361 6.875 40.8119 7.38206 39.9094 8.28462L20.625 27.5002V34.3752H27.5L46.7156 15.0909Z"
            stroke="#FFA629"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <small>Edit Site</small>
      </>
    ),
    content: <EditSite />,
  },
  {
    id: "editSchedule",
    label: (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
          <path
            d="M11.6667 5.00033V1.66699H15V5.00033H25V1.66699H28.3333V5.00033H35C35.442 5.00033 35.866 5.17592 36.1785 5.48848C36.4911 5.80104 36.6667 6.22496 36.6667 6.66699V15.0003H33.3333V8.33366H28.3333V11.667H25V8.33366H15V11.667H11.6667V8.33366H6.66668V31.667H16.6667V35.0003H5.00001C4.55798 35.0003 4.13406 34.8247 3.8215 34.5122C3.50894 34.1996 3.33334 33.7757 3.33334 33.3337V6.66699C3.33334 6.22496 3.50894 5.80104 3.8215 5.48848C4.13406 5.17592 4.55798 5.00033 5.00001 5.00033H11.6667ZM28.3333 20.0003C26.5652 20.0003 24.8695 20.7027 23.6193 21.9529C22.3691 23.2032 21.6667 24.8989 21.6667 26.667C21.6667 28.4351 22.3691 30.1308 23.6193 31.381C24.8695 32.6313 26.5652 33.3337 28.3333 33.3337C30.1015 33.3337 31.7971 32.6313 33.0474 31.381C34.2976 30.1308 35 28.4351 35 26.667C35 24.8989 34.2976 23.2032 33.0474 21.9529C31.7971 20.7027 30.1015 20.0003 28.3333 20.0003ZM18.3333 26.667C18.3333 25.3538 18.592 24.0534 19.0945 22.8402C19.5971 21.6269 20.3337 20.5245 21.2623 19.5959C22.1909 18.6673 23.2933 17.9307 24.5065 17.4282C25.7198 16.9256 27.0201 16.667 28.3333 16.667C29.6466 16.667 30.9469 16.9256 32.1602 17.4282C33.3734 17.9307 34.4758 18.6673 35.4044 19.5959C36.333 20.5245 37.0696 21.6269 37.5721 22.8402C38.0747 24.0534 38.3333 25.3538 38.3333 26.667C38.3333 29.3192 37.2798 31.8627 35.4044 33.7381C33.529 35.6134 30.9855 36.667 28.3333 36.667C25.6812 36.667 23.1376 35.6134 21.2623 33.7381C19.3869 31.8627 18.3333 29.3192 18.3333 26.667ZM26.6667 21.667V27.357L30.4883 31.1787L32.845 28.822L30 25.977V21.667H26.6667Z"
            fill="#FFA629"
          />
        </svg>
        <small> Schedule</small>
      </>
    ),
    content: <EditSchedule />,
  },
];

function Tab({ label, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={isActive ? "activeTabMenu tabMenuItem" : "tabMenuItem"}
    >
      {label}
    </div>
  );
}

function TabContent({ content }) {
  return <div className="p-4 text-gray-800">{content}</div>;
}

export default function Edit({
  showEditModelBox,
  setShowEditModelBox,
  id,
  closeModal,
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <>
      <div className="bgBlur">
        <div className=" entryContainer  siteEdit ">
          <div className="modelTitle">
            <h4>Detail Modal Box</h4>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
          </div>
          <div className="modalContent siteEditForm">
            <div className="tabMenu">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
            <div className="tabContent">
              <TabContent
                content={React.cloneElement(activeTabContent, {
                  onCancel: closeModal,
                  siteId: id,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
