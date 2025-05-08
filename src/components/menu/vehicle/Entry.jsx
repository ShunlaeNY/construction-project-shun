import dayjs from "dayjs"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCRUD } from "../../HOC/UseCRUD"
import { useFetchData } from "../../HOC/UseFetchData"
import "../../../assets/styles/entry.scss"
import "./entry.scss"
import ImageUpload from "../../HOC/inputBoxes/ImageUpload"
import Group from "./Group"

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
    data: initialGroups,
    loading,
    error,
    refetch: refetchGroupList,
  } = useFetchData("http://localhost:8383/group/list", deleteStatus)
  // Fetch data if id is provided
  const { data: vehicleData } = useFetchData(id ? `http://localhost:8383/vehicle/getbyid/${id}` : null)

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    groupId: "",
    status: "Deployed",
    inspectionExpiry: "",
    insuranceExpiry: "",
    // note: "",
  })

  const [errors, setErrors] = useState({})

  // console.log(localStorage.getItem("token"))

  const [groupOptions, setGroupOptions] = useState([])
  const [createGroup, setCreateGroup] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setGroupOptions(initialGroups || [])
  }, [initialGroups])

  useEffect(() => {
    if (vehicleData) {
      setFormData(vehicleData)
      // console.log(formData)
    }
  }, [vehicleData])

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

  const handleGroupCreated = (newGroup) => {
    setGroupOptions((prevGroups) => [...prevGroups, newGroup])
  }

  const validate = () => {
    const newErrors = {}

    // Check required fields with null/undefined checks
    if (!formData.name || !formData.name.trim()) newErrors.name = "Vehicle Name is required"
    if (!formData.groupId) newErrors.groupId = "Please select a Group"
    if (!formData.status) newErrors.status = "Status is required"
    if (!formData.inspectionExpiry) newErrors.inspectionExpiry = "Inspection Expiry date is required"
    if (!formData.insuranceExpiry) newErrors.insuranceExpiry = "Insurance Expiry date is required"

    // Date validation - only if both dates exist
    if (formData.inspectionExpiry && formData.insuranceExpiry) {
      const inspectionDate = dayjs(formData.inspectionExpiry)
      const insuranceDate = dayjs(formData.insuranceExpiry)

      if (inspectionDate.isBefore(dayjs())) {
        newErrors.inspectionExpiry = "Inspection Expiry date cannot be in the past"
      }

      if (insuranceDate.isBefore(dayjs())) {
        newErrors.insuranceExpiry = "Insurance Expiry date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      console.error("Validation failed", formData)
      return
    }

    const url = id ? `http://localhost:8383/vehicle/edit/${id}` : "http://localhost:8383/vehicle/add"
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
      console.log(formData);
      if (onSuccess) {
        onSuccess()
      }

      if (id) {
        setShowEditModelBox(false)
      } else {
        setShowCreateModelBox(false)
      }
      navigate("/vehicle")
    } catch (error) {
      console.error("Error submitting form:", error.message)
    }
  }

  const handleDeleteData = async (id) => {
    const url = `http://localhost:8383/vehicle/delete`
    await handleDelete(url, id) // Trigger the delete action
    if (onSuccess) {
      onSuccess()
    }
    setShowEditModelBox(false)
    navigate("/vehicle")
  }

  // Handle form clear/reset
  const handleClear = () => {
    setFormData({
      name: "",
      image: null,
      groupId: "",
      status: "Deployed",
      inspectionExpiry: "",
      insuranceExpiry: "",
      // note: "",
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
    navigate("/vehicle")
  }

  const handleCreateGroup = () => {
    setCreateGroup(true)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error occurred: {error.message}</div>

  return (
    <>
      <div className="bgBlur"></div>

      <div className={`entryContainer VentryContainer`}>
        <div className="modelTitle">
          <h4>{id ? "Edit Vehicle" : "Create Vehicle"}</h4>
        </div>

        <div className="modelContent">
          <form onSubmit={handleSubmit}>
            <div className={`formGroup modelTwoColumn`}>
              <div>
                <div>
                  <label htmlFor="name" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Vehicle Name</p>
                    </div>
                    <div className="instruction">
                      {errors.name ? (
                        <small className="error">{errors.name}</small>
                      ) : (
                        <small>Please enter displayed name( max 20 chars )</small>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    id="name"
                    placeholder="Enter your car's display name"
                  />
                </div>

                {/* group selection */}
                <div className="inputContainer">
                  <label htmlFor="group" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Group</p>
                    </div>
                    <div className="instruction">
                      {errors.groupId ? (
                        <small className="error">{errors.groupId}</small>
                      ) : (
                        <small>Please select group</small>
                      )}
                    </div>
                  </label>
                  <div className="flexRow" style={{ flexWrap: "nowrap" }}>
                    <select
                      name="groupId"
                      id="groupId"
                      onChange={handleChange}
                      value={formData.groupId}
                      className="input"
                    >
                      <option value="">--- Select Group ---</option>
                      {groupOptions.map((option, index) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={35}
                      viewBox="0 0 40 36"
                      fill="none"
                      onClick={handleCreateGroup}
                    >
                      <rect
                        x="0.641439"
                        y="0.502047"
                        width="38.355"
                        height="35"
                        rx="6.5"
                        transform="rotate(0.234996 0.641439 0.502047)"
                        fill="#141314"
                        stroke="#FF7B04"
                      />
                      <path
                        d="M22.3275 13.1094H18.417V20.3376H9.03162V23.5501H10.5958C10.5958 24.2167 10.8305 24.7789 11.2919 25.2608C11.769 25.7346 12.3087 25.9595 12.9422 25.9595C13.5757 25.9595 14.1153 25.7346 14.5924 25.2608C15.0539 24.7789 15.2885 24.2167 15.2885 23.5501H19.5901C19.5901 24.2167 19.8091 24.7789 20.2784 25.2608C20.7398 25.7346 21.2873 25.9595 21.9365 25.9595C22.5622 25.9595 23.1096 25.7346 23.5711 25.2608C24.0403 24.7789 24.2828 24.2167 24.2828 23.5501H26.2381V17.9282L22.3275 13.1094ZM13.7869 24.4094C13.5679 24.6504 13.2863 24.7548 12.9422 24.7548C12.598 24.7548 12.3165 24.6504 12.0975 24.4094C11.8785 24.1685 11.769 23.8874 11.769 23.5501C11.769 23.2369 11.8785 22.9558 12.0975 22.7148C12.3165 22.4739 12.598 22.3454 12.9422 22.3454C13.2863 22.3454 13.5679 22.4739 13.7869 22.7148C14.0058 22.9558 14.1153 23.2369 14.1153 23.5501C14.1153 23.8874 14.0058 24.1685 13.7869 24.4094ZM22.7499 24.4094C22.5152 24.6504 22.2415 24.7548 21.9365 24.7548C21.608 24.7548 21.3342 24.6504 21.0996 24.4094C20.865 24.1685 20.7633 23.8874 20.7633 23.5501C20.7633 23.2369 20.865 22.9558 21.0996 22.7148C21.3342 22.4739 21.608 22.3454 21.9365 22.3454C22.2415 22.3454 22.5152 22.4739 22.7499 22.7148C22.9845 22.9558 23.1096 23.2369 23.1096 23.5501C23.1096 23.8874 22.9845 24.1685 22.7499 24.4094ZM19.9812 17.9282V14.7156H21.5923L24.1968 17.9282H19.9812Z"
                        fill="#F27D14"
                      />
                      <path
                        d="M17.3661 5.95898H14.6289V12.2734H8.05951V15.0798H9.1544C9.1544 15.6621 9.31864 16.1532 9.64163 16.5742C9.97557 16.9881 10.3533 17.1846 10.7967 17.1846C11.2402 17.1846 11.6179 16.9881 11.9519 16.5742C12.2749 16.1532 12.4391 15.6621 12.4391 15.0798H15.45C15.45 15.6621 15.6033 16.1532 15.9318 16.5742C16.2548 16.9881 16.638 17.1846 17.0924 17.1846C17.5303 17.1846 17.9136 16.9881 18.2365 16.5742C18.565 16.1532 18.7347 15.6621 18.7347 15.0798H20.1033V10.1686L17.3661 5.95898ZM11.388 15.8305C11.2347 16.041 11.0376 16.1322 10.7967 16.1322C10.5559 16.1322 10.3588 16.041 10.2055 15.8305C10.0522 15.62 9.97557 15.3744 9.97557 15.0798C9.97557 14.8062 10.0522 14.5606 10.2055 14.3501C10.3588 14.1396 10.5559 14.0274 10.7967 14.0274C11.0376 14.0274 11.2347 14.1396 11.388 14.3501C11.5413 14.5606 11.6179 14.8062 11.6179 15.0798C11.6179 15.3744 11.5413 15.62 11.388 15.8305ZM17.6617 15.8305C17.4975 16.041 17.3059 16.1322 17.0924 16.1322C16.8625 16.1322 16.6709 16.041 16.5066 15.8305C16.3424 15.62 16.2712 15.3744 16.2712 15.0798C16.2712 14.8062 16.3424 14.5606 16.5066 14.3501C16.6709 14.1396 16.8625 14.0274 17.0924 14.0274C17.3059 14.0274 17.4975 14.1396 17.6617 14.3501C17.826 14.5606 17.9136 14.8062 17.9136 15.0798C17.9136 15.3744 17.826 15.62 17.6617 15.8305ZM15.7238 10.1686V7.36218H16.8515L18.6745 10.1686H15.7238Z"
                        fill="#F27D14"
                        fillOpacity="0.8"
                      />
                      <path
                        d="M34.0594 15.2885H30.0371V18.7305H28.6964V15.2885H24.6741V14.1412H28.6964V10.6992H30.0371V14.1412H34.0594V15.2885Z"
                        fill="#F27D14"
                      />
                    </svg>
                    {createGroup && (
                      <Group
                        createGroup={createGroup}
                        setCreateGroup={setCreateGroup}
                        groupOptions={groupOptions}
                        setGroupOptions={setGroupOptions}
                        onGroupCreated={handleGroupCreated}
                        showCreateModelBox={showCreateModelBox}
                        showEditModelBox={showEditModelBox}
                        setShowCreateModelBox={setShowCreateModelBox}
                        setShowEditModelBox={setShowEditModelBox}
                        onSuccess={refetchGroupList}
                      />
                    )}
                  </div>
                </div>

                {/* status selection */}
                <div className="inputContainer">
                  <label htmlFor="status" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Status</p>
                    </div>
                    <div className="instruction">
                      {errors.status ? (
                        <small className="error">{errors.status}</small>
                      ) : (
                        <small>Please select vehicle's status</small>
                      )}
                    </div>
                  </label>
                  <select
                    name="status"
                    id="status"
                    onChange={handleChange}
                    value={formData.status}
                    className="input"
                    
                  >
                    <option value="">--- Select Status ---</option>
                    <option value="Deployed">Deployed</option>
                    <option value="Scrapped">Scrapped</option>
                  </select>
                </div>
                <div className="vehicleInformation">
                  <h4>Vehicle Information</h4>

                  <div className="inputContainer">
                    <label htmlFor="inspectionExpiry" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Inspection Expiry</p>
                      </div>
                      <div className="instruction">
                        {errors.inspectionExpiry ? (
                          <small className="error">{errors.inspectionExpiry}</small>
                        ) : (
                          <small>Please select date</small>
                        )}
                      </div>
                    </label>
                    <input
                      type="date"
                      name="inspectionExpiry"
                      id="inspectionExpiry"
                      value={formData.inspectionExpiry ? dayjs(formData.inspectionExpiry).format("YYYY-MM-DD") : ""}
                      onChange={handleChange}
                      
                      className="input"
                    />
                  </div>
                  <div className="inputContainer">
                    <label htmlFor="insuranceExpiry" className="inputLabel">
                      <div className="flexRow">
                        <small>[Required]</small>
                        <p>Insurance Expiry</p>
                      </div>
                      <div className="instruction">
                        {errors.insuranceExpiry ? (
                          <small className="error">{errors.insuranceExpiry}</small>
                        ) : (
                          <small>Please select date</small>
                        )}
                      </div>
                    </label>
                    <input
                      type="date"
                      name="insuranceExpiry"
                      id="insuranceExpiry"
                      value={formData.insuranceExpiry ? dayjs(formData.insuranceExpiry).format("YYYY-MM-DD") : ""}
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
                      <p>Vehicle Photo</p>
                    </div>
                    <div className="instruction">
                      {errors.image ? (
                        <small className="error">{errors.image}</small>
                      ) : (
                        <small>Please upload vehicle photo</small>
                      )}
                    </div>
                  </label>
                  <div className="imageUploadContainer">
                    <ImageUpload handleFileChange={handleFileChange} value={formData.image} />
                  </div>
                </div>
              </div>
            </div>

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
                      d="M4.6875 7.5H8.4375V5.15625C8.4375 4.12207 9.27832 3.28125 10.3125 3.28125H19.6875C20.7217 3.28125 21.5625 4.12207 21.5625 5.15625V7.5H25.3125C25.8311 7.5 26.25 7.91895 26.25 8.4375V9.375C26.25 9.50391 26.1445 9.60938 26.0156 9.60938H24.2461L23.5225 24.9316C23.4756 25.9307 22.6494 26.7188 21.6504 26.7188H8.34961C7.34766 26.7188 6.52441 25.9336 6.47754 24.9316L5.75391 9.60938H3.98438C3.85547 9.60938 3.75 9.50391 3.75 9.375V8.4375C3.75 7.91895 4.16895 7.5 4.6875 7.5ZM10.5469 7.5H19.4531V5.39062H10.5469V7.5Z"
                      fill="#F24822"
                    />
                  </svg>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

