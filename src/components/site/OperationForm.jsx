import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCRUD } from "../HOC/UseCRUD";
import { useFetchData } from "../HOC/UseFetchData";
import dayjs from "dayjs";
import OperationType from "./OperationType";
export default function OperationForm({
  onCancel,
  onSuccess,
  siteId,
  showCreateModelBox,
  setShowCreateModelBox,
  setShowEditModelBox,
  showEditModelBox,
}) {
  console.log("SITE ID IDIDID", siteId);
  const {
    handleDelete,
    handleCreate,
    handleEdit,
    loading: crudLoading,
    error: crudError,
    deleteStatus,
    refetch,
  } = useCRUD();
  const {
    data: initialOperations,
    loading,
    error,
    refetch: refetchOperationList,
  } = useFetchData("http://localhost:8383/operationtypes/list", deleteStatus);
  console.log("Operation", initialOperations);
  const [formData, setFormData] = useState({
    siteId: siteId || "", // Avoid undefined
    operationtypesId: "",
    startDate: "",
    endDate: "",
    workinghourStart: "",
    workinghourEnd: "",
    requiredStaff: "",
    requiredVehicle: "",
  });

  const [operationOptions, setOperationOptions] = useState([]);
  const [createOperation, setCreateOperation] = useState(false);
  useEffect(() => {
    setOperationOptions(initialOperations || []);
  }, [initialOperations]);
  console.log("Operation Option from Edit", operationOptions);

  const handleOperationCreated = (newOperation) => {
    setOperationOptions((prevOperations) => [...prevOperations, newOperation]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateOperation = () => {
    // navigate("/staff/team");
    console.log("handle Create Operation");
    setCreateOperation(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const siteOperationUrl = "http://localhost:8383/siteoperation/add";
    const allAddUrl = "http://localhost:8383/all/add";
    const method = "POST";
    try {
      const SiteOperaitonResponse = await axios({
        method,
        url:siteOperationUrl,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", SiteOperaitonResponse.data);
      const newId = SiteOperaitonResponse.data.data.id;
      console.log(newId);
      if(!newId){
        throw new Error("Failed to get If from site operation creation")
      }

      const allAddResponse = await axios({
        method,
        url:allAddUrl,
        data: {
          siteoperationtypesId: newId,
          staffId: null,
          vehicleId: null,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", allAddResponse.data);
      if (onSuccess) {
        onSuccess();
      }
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }    
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
  }
  return (
    <div>
      <div className="bgBlur"> </div>

      <form onSubmit={handleSubmit} className="editScheduleTab  ">
        <div className="title">
          <h4>Add Operation to this site</h4>
        </div>

        <div className=" editScheduleTabContent">
          <div>
            <label htmlFor="operationtypesId" className="inputLabel inputLabel2">
              <div className="flexRow">
                <small className="small">[Required]</small>
                <p className="paragraph">Operation Type</p>
              </div>
              <div className="instruction">
                <small className="small">Please Select Operation</small>
              </div>
            </label>
            <div className="flexRow operationRow">
              <select
                name="operationtypesId"
                id="operationtypesId"
                onChange={handleChange}
                value={formData.operationtypesId}
                className="input"
                required
              >
                <option value="" disabled>
                  --- Select Operation ---
                </option>
                {operationOptions.map((option, index) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>

              {/* <button onClick={handleCreateOperation} className="addBtn">
                +
              </button> */}
              <div onClick={handleCreateOperation} className="addnewOperation">
              <svg xmlns="http://www.w3.org/2000/svg" width="35"  viewBox="0 0 37 36" fill="none">
                <rect x="0.497817" y="0.501925" width="32
                " height="33" rx="6.5" transform="matrix(0.999993 0.00385948 -0.00435857 0.99999 1.08764 0.382849)" fill="#141314" stroke="#FF7B04"/>
                <path d="M16.8981 8.4375C16.1331 8.4372 15.379 8.61697 14.6978 8.96201C14.0166 9.30705 13.4278 9.80749 12.9799 10.4221C12.532 11.0368 12.2378 11.7481 12.1215 12.4975C12.0052 13.2469 12.0702 14.0129 12.311 14.7325L5.38506 21.5985C5.0988 21.8824 4.93799 22.2674 4.93799 22.6688C4.93799 23.0701 5.0988 23.4551 5.38506 23.739L6.29095 24.6368C6.43275 24.7775 6.60114 24.8891 6.78651 24.9653C6.97187 25.0415 7.17056 25.0807 7.37122 25.0807C7.57188 25.0807 7.77057 25.0415 7.95593 24.9653C8.14129 24.8891 8.30968 24.7775 8.45148 24.6368L15.3783 17.7708C16.2051 18.043 17.0909 18.0885 17.9417 17.9024C18.7925 17.7164 19.5767 17.3057 20.2112 16.714C20.8458 16.1223 21.3071 15.3715 21.5462 14.5411C21.7853 13.7108 21.7934 12.8318 21.5696 11.9972C21.3406 11.1404 20.3279 11.055 19.8199 11.5586L18.3362 13.0282C18.2554 13.1113 18.1588 13.1776 18.0519 13.2232C17.945 13.2689 17.83 13.293 17.7136 13.2941C17.5972 13.2951 17.4818 13.2732 17.3741 13.2296C17.2663 13.1859 17.1684 13.1214 17.0861 13.0399C17.0038 12.9583 16.9387 12.8613 16.8947 12.7545C16.8507 12.6477 16.8286 12.5333 16.8297 12.418C16.8308 12.3026 16.855 12.1886 16.9011 12.0827C16.9472 11.9767 17.0141 11.881 17.0979 11.8009L18.5807 10.3305C19.0888 9.82692 19.0027 8.82326 18.1373 8.59624C17.7332 8.49037 17.3169 8.43701 16.899 8.4375" fill="#F27D14"/>
                <path d="M32.6845 13.284H29.6245V16.434H28.2745V13.284H25.2325V11.988H28.2745V8.838H29.6245V11.988H32.6845V13.284Z" fill="#F27D14"/>
              </svg>
              </div>
              {createOperation && (
                <OperationType
                  createOperation={createOperation}
                  setCreateOperation={setCreateOperation}
                  operationOptions={operationOptions}
                  setOperationOptions={setOperationOptions}
                  onOperationCreated={handleOperationCreated}
                  showCreateModelBox={showCreateModelBox}
                  showEditModelBox={showEditModelBox}
                  setShowCreateModelBox={setShowCreateModelBox}
                  setShowEditModelBox={setShowEditModelBox}
                  onSuccess={refetchOperationList}
                />
              )}
            </div>
            <div>
              <label htmlFor="startDate" className="inputLabel inputLabel2">
                <div className="flexRow">
                  <small className="small">[Required]</small>
                  <p className="paragraph">Schedule</p>
                </div>
                <div className="instruction">
                  <small className="small">Please Select Schedule Date</small>
                </div>
              </label>
              <div className="flexContainer">
                <div className="flexDiv">
                  <p className="paragraph">Start: </p>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    className="input"
                    value={
                      formData.startDate
                        ? dayjs(formData.startDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className="flexDiv">
                  <p className="paragraph">End:</p>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    required
                    className="input"
                    value={
                      formData.endDate
                        ? dayjs(formData.endDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="joinedDate" className="inputLabel inputLabel2">
                <div className="flexRow">
                  <small className="small">[Required]</small>
                  <p className="paragraph">Working Hour</p>
                </div>
                <div className="instruction">
                  <small className="small">Please Select Schedule Date</small>
                </div>
              </label>
              <div className="  flexContainer">
                <div className=" flexDiv">
                  <p className="paragraph">Start: </p>
                  <select
                    name="workinghourStart"
                    id="workinghourStart"
                    onChange={handleChange}
                    value={formData.workinghourStart}
                    className="input"
                    required
                  >
                    <option value="">Select Start Time</option>
                    <option value="6">6 AM</option>
                    <option value="7">7 AM</option>
                    <option value="8">8 AM</option>
                    <option value="9">9 AM</option>
                    <option value="10">10 AM</option>
                  </select>
                </div>
                <div className="flexRow flexDiv ">
                  <p className="paragraph">End:</p>
                  <select
                    name="workinghourEnd"
                    id="workinghourEnd"
                    onChange={handleChange}
                    value={formData.workinghourEnd}
                    className="input"
                    required
                  >
                    <option value="">Select Start Time</option>
                    <option value="3">3 PM</option>
                    <option value="4">4 PM</option>
                    <option value="5">5 PM</option>
                    <option value="6">6 PM</option>
                    <option value="7">7 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="schedule" className="inputLabel inputLabel2">
              <div className="flexRow">
                <small className="small">[Required]</small>
                <p className="paragraph">Requirements</p>
              </div>
              <div className="instruction">
                <small className="small">Please type Requirement</small>
              </div>
            </label>
            <div className="flexContainer">
              <div className="flexDiv">
                <p className="paragraph">Staffs: </p>
                <input
                  type="number"
                  name="requiredStaff"
                  id="requiredStaff"
                  required
                  className="input"
                  min="1"
                  step="1"
                  
                  onChange={handleChange}
                  value={formData.requiredStaff}
                />
              </div>
              <div className="flexDiv">
                <p className="paragraph">Vehicles:</p>
                <input
                  type="number"
                  name="requiredVehicle"
                  id="requiredVehicle"
                  required
                  className="input"
                  min="1"
                  step="1"
                  // onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  value={formData.requiredVehicle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="operationFormBtnContainer editBtnContainer ">
          <div></div>
          <div className="btnWrapper">
            <button onClick={onCancel} className="cancelBtn">
              Cancel
            </button>
            <button type="submit" className="saveBtn">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
