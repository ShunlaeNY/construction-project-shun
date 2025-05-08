import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCRUD } from "../../HOC/UseCRUD"
import { useFetchData } from "../../HOC/UseFetchData"
import "../../../assets/styles/entry.scss"
import "./entry.scss"
import axios from "axios"

export default function Entry({
  id,
  showCreateModelBox,
  setShowCreateModelBox,
  setShowEditModelBox,
  showEditModelBox,
  onSuccess,
}) {
  const colors = ["red", "blue", "green", "orange", "lightblue", "lightgreen", "gray", "whitesmoke"]
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { handleDelete, handleCreate, handleEdit, loading, error, refetch } = useCRUD()

  // Fetch data if `id` is provided
  const { data: operationTypeData } = useFetchData(id ? `http://localhost:8383/operationtypes/getbyid/${id}` : null)

  const [formData, setFormData] = useState({
    name: "",
    color: getRandomColor(),
  })

  useEffect(() => {
    if (operationTypeData) {
      setFormData({
        name: operationTypeData.name || "",
        color: operationTypeData.color || getRandomColor(),
      })
    }
  }, [operationTypeData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}

    // Check required fields
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Operation Type Name is required"
    } else if (formData.name.trim().length > 20) {
      newErrors.name = "Name must be 20 characters or less"
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

    setSubmitting(true)
    console.log(formData)

    const url = id ? `http://localhost:8383/operationtypes/edit/${id}` : "http://localhost:8383/operationtypes/add"
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
      console.log(response.data)
      if (onSuccess) {
        onSuccess()
      }
      if (id) {
        setShowEditModelBox(false)
      } else {
        setShowCreateModelBox(false)
      }
      navigate("/operation-type")
    } catch (error) {
      console.error("Error submitting form:", error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteData = async () => {
    const url = `http://localhost:8383/operationtypes/delete`
    await handleDelete(url, id) // Trigger the delete action
    if (onSuccess) {
      onSuccess()
    }
    setShowEditModelBox(false)
    navigate("/operation-type")
  }

  const handleClear = () => {
    setFormData({
      name: "",
      color: getRandomColor(),
    })
    setErrors({})
  }

  const handleCancel = () => {
    handleClear()
    if (!id) {
      handleClear()
      setShowCreateModelBox(false)
    } else {
      setShowEditModelBox(false)
      handleClear()
    }
    navigate("/operation-type")
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error occurred: {error.message}</div>

  return (
    <>
      <div className="bgBlur"></div>
      <div className={`entryContainer OTentryContainer`}>
        <div className="modelTitle">
          <h4>{id ? "Edit Operation Type" : "Create New Operation Type"}</h4>
        </div>
        <div className="modelContent">
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="name" className="inputLabel">
                <div className="flexRow">
                  <small>[Required]</small>
                  <p>Operation Type Name</p>
                </div>
                <div className="instruction">
                  {errors.name ? (
                    <small className="error">{errors.name}</small>
                  ) : (
                    <small>Please enter operation type</small>
                  )}
                </div>
              </label>
              <div className="flexRow colorFlexRow">
                <div className="color" style={{ backgroundColor: formData.color }}></div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter operation type name"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="btnContainer">
              <button type="button" onClick={handleCancel} className="cancelBtn" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="saveBtn" disabled={submitting}>
                {submitting ? "Saving..." : id ? "Update" : "Save"}
              </button>
              {id && (
                <div
                  onClick={() => !submitting && handleDeleteData(id)}
                  className={`deleteBtn ${submitting ? "disabled" : ""}`}
                >
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

