import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCRUD } from "../../HOC/UseCRUD"
import { useFetchData } from "../../HOC/UseFetchData"
import "../../../assets/styles/entry.scss"
import "./entry.scss"
import ImageUpload from "../../HOC/inputBoxes/ImageUpload"
import { jwtDecode } from "jwt-decode"
export default function Entry({
  id,
  showCreateModelBox,
  setShowCreateModelBox,
  setShowEditModelBox,
  showEditModelBox,
  onSuccess,
}) {
  const extractIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
};

// Usage
const token = localStorage.getItem("accessToken");
const adminId = token ? extractIdFromToken(token) : null;

console.log("Extracted User ID:", adminId);


  const navigate = useNavigate()
  const { handleDelete, handleCreate, handleEdit, loading, error, refetch } = useCRUD()

  // Fetch data if id is provided
  const { data: businesspartnerData } = useFetchData(id ? `http://localhost:8383/businesspartner/getbyid/${id}` : null)

  console.log(localStorage.getItem("id"))
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    phonenumber: "",
    email: "",
    address: "",
    staffId: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (businesspartnerData) {
      setFormData(businesspartnerData)
    }
  }, [businesspartnerData])

  console.log(formData)

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

  const validate = () => {
    const newErrors = {}

    // Check required fields with null/undefined checks
    if (!formData.name || !formData.name.trim()) newErrors.name = "Partner Name is required"
    if (!formData.phonenumber || !formData.phonenumber.trim()) newErrors.phonenumber = "Phone Number is required"
    if (!formData.email || !formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.address || !formData.address.trim()) newErrors.address = "Address is required"

    // Email validation
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    // Phone validation
    if (formData.phonenumber && formData.phonenumber.trim()) {
      const phoneRegex = /^\d{10,}$/
      if (!phoneRegex.test(formData.phonenumber.replace(/[^0-9]/g, ""))) {
        newErrors.phonenumber = "Please enter a valid phone number"
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

    const updatedFormdata = { ...formData, staffId: adminId }
    console.log("Form Submitted:", updatedFormdata)

    const url = id ? `http://localhost:8383/businesspartner/edit/${id}` : "http://localhost:8383/businesspartner/add"
    const method = id ? "PUT" : "POST"
    try {
      const response = await axios({
        method,
        url,
        data: updatedFormdata,
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
      navigate("/business-partner")
    } catch (error) {
      console.error("Error submitting form:", error.message)
    }
  }

  const handleDeleteData = async (id) => {
    const url = `http://localhost:8383/businesspartner/delete`
    await handleDelete(url, id)
    if (onSuccess) {
      onSuccess()
    }
    setShowEditModelBox(false)
    navigate("/business-partner")
  }

  // Handle form clear/reset
  const handleClear = () => {
    setFormData({
      name: "",
      image: "",
      phonenumber: "",
      email: "",
      address: "",
      staffId: adminId,
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
    navigate("/business-partner")
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error occurred: {error.message}</div>

  return (
    <>
      <div className="bgBlur"></div>
      <div className={`entryContainer BPentryContainer`}>
        <div className="modelTitle">
          <h4>{id ? "Edit Business Partner" : "Create Business Partner"}</h4>
        </div>
        <div className="modelContent">
          <form onSubmit={handleSubmit}>
            <div className={`formGroup modelTwoColumn`}>
              <div>
                <div>
                  <label htmlFor="name" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Partner Name</p>
                    </div>
                    <div className="instruction">
                      {errors.name ? (
                        <small className="error">{errors.name}</small>
                      ) : (
                        <small>Please enter partnername( max 20 chars )</small>
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
                    placeholder="Enter business partner name"
                  />
                </div>
                <div className="inputContainer">
                  <label htmlFor="phonenumber" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Phone Number</p>
                    </div>
                    <div className="instruction">
                      {errors.phonenumber ? (
                        <small className="error">{errors.phonenumber}</small>
                      ) : (
                        <small>Please enter phonenumber</small>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    className="input"
                    id="phonenumber"
                    placeholder="Enter business partner's phone number"
                  />
                </div>
                <div className="inputContainer">
                  <label htmlFor="email" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Email</p>
                    </div>
                    <div className="instruction">
                      {errors.email ? (
                        <small className="error">{errors.email}</small>
                      ) : (
                        <small>Please enter email</small>
                      )}
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    id="email"
                    placeholder="Enter business partner's mail"
                  />
                </div>
                <div className="inputContainer">
                  <label htmlFor="address" className="inputLabel">
                    <div className="flexRow">
                      <small>[Required]</small>
                      <p>Address</p>
                    </div>
                    <div className="instruction">
                      {errors.address ? (
                        <small className="error">{errors.address}</small>
                      ) : (
                        <small>Please enter address</small>
                      )}
                    </div>
                  </label>
                  {/* Address map */}
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                    id="address"
                    placeholder="Enter business partner's address"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="image" className="inputLabel">
                  <div className="flexRow">
                    <small>[Required]</small>
                    <p>Profile Photo</p>
                  </div>
                  <div className="instruction">
                    {errors.image ? (
                      <small className="error">{errors.image}</small>
                    ) : (
                      <small>Please upload profile photo</small>
                    )}
                  </div>
                </label>
                <div className="imageUploadContainer">
                  <ImageUpload value={formData.image} handleFileChange={handleFileChange} />
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



