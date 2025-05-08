import dayjs from "dayjs"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCRUD } from "../../HOC/UseCRUD"
import { useFetchData } from "../../HOC/UseFetchData"
import "../../../assets/styles/list.scss"
import "../../menu/staff/entry.scss"
import "../../../assets/styles/entry.scss"
import ImageUpload from "../../HOC/inputBoxes/ImageUpload"
import Team from "./Team"
export default function Entry({
  id,
  showCreateModelBox,
  setShowCreateModelBox,
  setShowEditModelBox,
  showEditModelBox,
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
  } = useCRUD()
  const {
    data: initialTeams,
    loading,
    error,
    refetch: refetchTeamList,
  } = useFetchData("http://localhost:8383/team/list", deleteStatus)
  const { data: usertypes } = useFetchData("http://localhost:8383/usertypes/list", deleteStatus)

  // Fetch data if id is provided
  const { data: staffData } = useFetchData(id ? `http://localhost:8383/staff/getbyid/${id}` : null)

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    usertypesId: "",
    teamId: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    employmentStatus: "Employed",
    workingStatus: "Available",
    position: "",
    dob: "",
    joinedDate: "",
  })

  const [errors, setErrors] = useState({})

  const [teamOptions, setTeamOptions] = useState([])
  const [createTeam, setCreateTeam] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTeamOptions(initialTeams || [])
  }, [initialTeams])
  // console.log(teamOptions);

  useEffect(() => {
    if (staffData) {
      setFormData(staffData)
    }
  }, [staffData])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleTeamCreated = (newTeam) => {
    setTeamOptions((prevTeams) => [...prevTeams, newTeam])
  }

  const validate = () => {
    const newErrors = {}

    // Check required fields with null/undefined checks
    if (!formData.name || !formData.name.trim()) newErrors.name = "Staff Name is required"
    if (!formData.teamId) newErrors.teamId = "Please select a Team"
    if (!formData.email || !formData.email.trim()) newErrors.email = "Email is required"
    if ((!formData.password || !formData.password.trim()) && !id) newErrors.password = "Password is required"
    if (!formData.address || !formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required"
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment Status is required"
    if (!formData.workingStatus) newErrors.workingStatus = "Working Status is required"
    if (!formData.position) newErrors.position = "Position is required"
    if (!formData.dob) newErrors.dob = "Date of Birth is required"
    if (!formData.joinedDate) newErrors.joinedDate = "Joined Date is required"
    if (!formData.usertypesId) newErrors.usertypesId = "Account Type is required"

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
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      console.error("Validation failed", formData)
      return
    }

    console.log("Form Submitted:", formData)

    const url = id ? `http://localhost:8383/staff/edit/${id}` : "http://localhost:8383/staff/add"

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
      // console.log(onSuccessEdit);
      if (onSuccess) {
        onSuccess()
      }

      if (id) {
        setShowEditModelBox(false)
      } else {
        setShowCreateModelBox(false)
      }
      navigate("/staff")
    } catch (error) {
      console.error("Error submitting form:", error.message)
    }
  }

  const handleDeleteData = async (id) => {
    const url = `http://localhost:8383/staff/delete`
    await handleDelete(url, id) // Trigger the delete action
    if (onSuccess) {
      onSuccess()
    }
    setShowEditModelBox(false)
    navigate("/staff")
  }

  // Handle form clear/reset
  const handleClear = () => {
    setFormData({
      name: "",
      image: "",
      usertypesId: "",
      teamId: "",
      email: "",
      password: "",
      address: "",
      phoneNumber: "",
      employmentStatus: "Employed",
      workingStatus: "Available",
      position: "",
      dob: "",
      joinedDate: "",
    })
    setErrors({})
  }

  const handleCancel = () => {
    if (!id) {
      handleClear()
      setShowCreateModelBox(false)
    } else {
      setShowEditModelBox(false)
      handleClear()
    }
    navigate("/staff")
  }

  const handleCreateTeam = () => {
    setCreateTeam(true)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error occurred: {error.message}</div>

  return (
    <>
      <div className="bgBlur"></div>
      <div className="entryContainer StaffentryContainer">
        <div className="modelTitle">
          <h4>{id ? "Edit Staff Data" : "Create New Staff"}</h4>
        </div>
        <div className="modelContent">
          <form onSubmit={handleSubmit}>
            <div className="scroll">
              <div className="formGroup modelTwoColumn">
                <div>
                  {/* team */}
                  <div className="inputContainer">
                    <label htmlFor="teamId" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Team</p>
                      </div>
                      <div className="instruction">
                        {errors.teamId && <small className="error">{errors.teamId}</small>}
                      </div>
                    </label>
                    <div className="flexRow" style={{ flexWrap: "nowrap" }}>
                      <select
                        name="teamId"
                        id="teamId"
                        onChange={handleChange}
                        value={formData.teamId}
                        className="input"
                      >
                        <option value="">--- Select Team ---</option>
                        {teamOptions.map((option, index) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <svg
                        onClick={handleCreateTeam}
                        xmlns="http://www.w3.org/2000/svg"
                        width="41"
                        height="36"
                        viewBox="0 0 41 36"
                        fill="none"
                      >
                        <rect
                          x="1.58217"
                          y="0.543062"
                          width="38.355"
                          height="34"
                          rx="6.5"
                          transform="rotate(0.234996 1.58217 0.543062)"
                          fill="#141314"
                          stroke="#FF7B04"
                        />
                        <path
                          d="M16.917 16.25C18.2977 16.25 19.417 15.1307 19.417 13.75C19.417 12.3693 18.2977 11.25 16.917 11.25C15.5363 11.25 14.417 12.3693 14.417 13.75C14.417 15.1307 15.5363 16.25 16.917 16.25Z"
                          stroke="#F27D14"
                          strokeLinecap="round"
                        />
                        <path
                          d="M20.685 14.2498C20.8153 14.0205 20.9898 13.8192 21.1982 13.6576C21.4067 13.496 21.645 13.3773 21.8996 13.3082C22.1541 13.239 22.4198 13.221 22.6814 13.255C22.9429 13.289 23.1952 13.3744 23.4236 13.5062C23.652 13.6381 23.8521 13.8139 24.0123 14.0234C24.1725 14.2329 24.2897 14.4721 24.3572 14.7271C24.4246 14.9821 24.4409 15.2479 24.4052 15.5092C24.3694 15.7705 24.2824 16.0222 24.149 16.2498C23.8819 16.7054 23.4454 17.0369 22.9348 17.1718C22.4242 17.3068 21.8809 17.2344 21.4236 16.9703C20.9662 16.7062 20.6318 16.272 20.4935 15.7623C20.3551 15.2526 20.4239 14.7089 20.685 14.2498Z"
                          stroke="#F27D14"
                        />
                        <path
                          d="M21.417 23.75H12.417V24.75H21.417V23.75ZM12.005 23.336C12.135 22.522 12.447 21.365 13.181 20.421C13.896 19.501 15.036 18.75 16.917 18.75V17.75C14.718 17.75 13.291 18.65 12.391 19.807C11.511 20.941 11.16 22.287 11.018 23.178L12.005 23.336ZM16.917 18.75C18.798 18.75 19.937 19.5 20.653 20.421C21.387 21.365 21.699 22.521 21.829 23.336L22.816 23.178C22.674 22.288 22.324 20.941 21.443 19.808C20.543 18.65 19.116 17.75 16.917 17.75V18.75ZM12.417 23.75C12.125 23.75 11.974 23.533 12.005 23.336L11.018 23.178C10.875 24.072 11.604 24.75 12.417 24.75V23.75ZM21.417 24.75C22.23 24.75 22.958 24.072 22.816 23.178L21.829 23.336C21.86 23.533 21.709 23.75 21.417 23.75V24.75Z"
                          fill="#F27D14"
                        />
                        <path
                          d="M20.7171 19.731L20.4491 19.309L19.9341 19.636L20.3561 20.076L20.7171 19.731ZM25.3121 23.75H21.4171V24.75H25.3121V23.75ZM25.7291 23.288C25.7821 23.503 25.6251 23.75 25.3121 23.75V24.75C26.1821 24.75 26.9321 23.978 26.6991 23.045L25.7291 23.288ZM22.4171 19.75C23.4451 19.75 24.1671 20.253 24.6951 20.957C25.2351 21.675 25.5511 22.582 25.7291 23.288L26.6991 23.045C26.5071 22.281 26.1491 21.229 25.4951 20.356C24.8301 19.47 23.8371 18.75 22.4171 18.75V19.75ZM20.9851 20.153C21.3751 19.906 21.8431 19.75 22.4171 19.75V18.75C21.6491 18.75 20.9961 18.962 20.4491 19.309L20.9851 20.153ZM20.3561 20.076C21.3031 21.066 21.6821 22.415 21.8291 23.336L22.8161 23.178C22.6561 22.178 22.2331 20.592 21.0791 19.385L20.3561 20.076ZM21.8291 23.336C21.8601 23.533 21.7091 23.75 21.4171 23.75V24.75C22.2301 24.75 22.9581 24.072 22.8161 23.178L21.8291 23.336Z"
                          fill="#F27D14"
                        />
                        <path
                          d="M29.417 11H25.417C25.2789 11 25.167 11.1119 25.167 11.25C25.167 11.3881 25.2789 11.5 25.417 11.5H29.417C29.5551 11.5 29.667 11.3881 29.667 11.25C29.667 11.1119 29.5551 11 29.417 11Z"
                          stroke="#F27D14"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M27.667 13.25V9.25C27.667 9.11193 27.5551 9 27.417 9C27.2789 9 27.167 9.11193 27.167 9.25V13.25C27.167 13.3881 27.2789 13.5 27.417 13.5C27.5551 13.5 27.667 13.3881 27.667 13.25Z"
                          stroke="#F27D14"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {createTeam && (
                        <Team
                          createTeam={createTeam}
                          setCreateTeam={setCreateTeam}
                          teamOptions={teamOptions}
                          setTeamOptions={setTeamOptions}
                          onTeamCreated={handleTeamCreated}
                          showCreateModelBox={showCreateModelBox}
                          showEditModelBox={showEditModelBox}
                          setShowCreateModelBox={setShowCreateModelBox}
                          setShowEditModelBox={setShowEditModelBox}
                          onSuccess={refetchTeamList}
                        />
                      )}
                    </div>
                  </div>

                  {/* name */}
                  <div>
                    <label htmlFor="name" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Staff Name</p>
                      </div>
                      <div className="instruction">{errors.name && <small className="error">{errors.name}</small>}</div>
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

                  {/* employmentStatus */}
                  <div className="inputContainer">
                    <label htmlFor="employmentStatus" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Employment Status</p>
                      </div>
                      <div className="instruction">
                        {errors.employmentStatus && <small className="error">{errors.employmentStatus}</small>}
                      </div>
                    </label>
                    <select
                      name="employmentStatus"
                      id="employment"
                      onChange={handleChange}
                      value={formData.employmentStatus}
                      className="input"
                      
                    >
                      <option value="">--- Select Status ---</option>
                      <option value="Employed">Currently Employed</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  {/* workingStatus */}
                  <div className="inputContainer">
                    <label htmlFor="workingStatus" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Working Status</p>
                      </div>
                      <div className="instruction">
                        {errors.workingStatus && <small className="error">{errors.workingStatus}</small>}
                      </div>
                    </label>
                    <select
                      name="workingStatus"
                      id="workingStatus"
                      onChange={handleChange}
                      value={formData.workingStatus}
                      className="input"
                      
                    >
                      <option value="">--- Select Status ---</option>
                      <option value="Available">Available</option>
                      <option value="onLeave">On Leave</option>
                      <option value="Busy">Busy</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Phone</p>
                      </div>
                      <div className="instruction">
                        {errors.phoneNumber && <small className="error">{errors.phoneNumber}</small>}
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
                        {errors.address && <small className="error">{errors.address}</small>}
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

                  <div className="inputContainer">
                    <label htmlFor="position" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Position</p>
                      </div>
                      <div className="instruction">
                        {errors.position && <small className="error">{errors.position}</small>}
                      </div>
                    </label>
                    <div className="flexRow">
                      <select
                        name="position"
                        id="position"
                        className="input"
                        onChange={handleChange}
                        value={formData.position}
                        
                      >
                        <option value="">--- Select Staff's Position ---</option>
                        <option value="manager">Manager</option>
                        <option value="engineer">Engineer</option>
                        <option value="driver">Driver</option>
                        <option value="craftman">Craftman</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="dob" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>DOB</p>
                      </div>
                      <div className="instruction">{errors.dob && <small className="error">{errors.dob}</small>}</div>
                    </label>
                    <div className="flexRow inputRow">
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : ""}
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
                        {errors.joinedDate && <small className="error">{errors.joinedDate}</small>}
                      </div>
                    </label>
                    <div className="flexRow">
                      <input
                        type="date"
                        name="joinedDate"
                        value={formData.joinedDate ? dayjs(formData.joinedDate).format("YYYY-MM-DD") : ""}
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
                        {errors.image && <small className="error">{errors.image}</small>}
                      </div>
                    </label>
                    <div className=" inputRow">
                      <ImageUpload handleFileChange={handleFileChange} value={formData.image} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Staff Email</p>
                      </div>
                      <div className="instruction">
                        {errors.email && <small className="error">{errors.email}</small>}
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
                        {errors.password && <small className="error">{errors.password}</small>}
                      </div>
                    </label>
                    <div className="flexRow inputRow">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        
                        className={`input ${formData.id ? "readOnlyInput" : ""}`}
                        placeholder="Enter Staff Password"
                        readOnly={!!id}
                      />
                    </div>
                  </div>
                  <input type="hidden" name="workingStatus" value={formData.workingStatus} />
                  <div>
                    <label htmlFor="usertypesId" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Account Type</p>
                      </div>
                      <div className="instruction">
                        {errors.usertypesId && <small className="error">{errors.usertypesId}</small>}
                      </div>
                    </label>
                    <div className="flexRow inputRow">
                      <select
                        name="usertypesId"
                        id="usertypesId"
                        className="input"
                        onChange={handleChange}
                        value={formData.usertypesId}
                      >
                        <option value="">--- Select Account type ---</option>
                        {usertypes.map((option, index) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* <div className="checkBoxContaier">
                      <label htmlFor="name" className="inputLabel">
                        <div className="flexRow">
                          <small>[Required]</small>
                          <p>Skills</p>
                        </div>
                        <div className="instruction">
                          <small>Choose Staff Skills</small>
                        </div>
                      </label>
                        {skills.map((skill) => (
                          <Checkbox label={skill.name} id={skill.id} value={skill.id} name={`skill-${skill.id}`}/>
                        ))}
                    </div> */}
                </div>
              </div>
            </div>

            <div className="btnGp">
              {/* <hr /> */}
              <div className="btnContainer">
                <button type="button" onClick={handleCancel} className="cancelBtn">
                  Cancel
                </button>
                <button type="submit" className="saveBtn">
                  {id ? "Update" : "Register"}
                </button>
                {id && (
                  <div onClick={() => handleDeleteData(id)} className="deleteBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 30 30" fill="none">
                      <path
                        d="M4.6875 7.5H8.4375V5.15625C8.4375 4.12207 9.27832 3.28125 10.3125 3.28125H19.6875C20.7217 3.28125 21.5625 4.12207 21.5625 5.15625V7.5H25.3125C25.8311 7.5 26.25 7.91895 26.25 8.4375V9.375C26.25 9.50391 26.1445 9.60938 26.0156 9.60938H24.2461L23.5225 24.9316C23.4756 25.9307 22.6494 26.7188 21.6504 26.7188H8.34961C7.34766 26.7188 6.52441 25.9336 6.47754 24.9316L5.75391 9.60938H3.98438C3.85547 9.60938 3.75 9.50391 3.75 9.375V8.4375C3.75 7.91895 4.16895 7.5 4.6875 7.5Z"
                        fill="#F24822"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        {createTeam && (
          <Team
            createTeam={createTeam}
            setCreateTeam={setCreateTeam}
            teamOptions={teamOptions}
            setTeamOptions={setTeamOptions}
            onTeamCreated={handleTeamCreated}
            showCreateModelBox={showCreateModelBox}
            showEditModelBox={showEditModelBox}
            setShowCreateModelBox={setShowCreateModelBox}
            setShowEditModelBox={setShowEditModelBox}
            onSuccess={refetchTeamList}
          />
        )}
      </div>
    </>
  )
}



            