"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFetchData } from "../HOC/UseFetchData"
import { useCRUD } from "../HOC/UseCRUD"
import Search from "../HOC/searchAndFilter/Search"
import axios from "axios"
import "./StaffAdd.scss"

export default function VehicleAdd({ id, setClickStatus, refetchdata }) {
  const navigate = useNavigate()
  const handleCancel = () => {
    setClickStatus(false)
  }

  const { deleteStatus } = useCRUD()
  const { data: Vehicles } = useFetchData("http://localhost:8383/vehicle/list", deleteStatus)
  const { data: Groups } = useFetchData("http://localhost:8383/group/list", deleteStatus)
  const { data: selectedVehicles } = useFetchData(`http://localhost:8383/all/getbysiteoperationid/${id}`, deleteStatus)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState([])

  useEffect(() => {
    if (selectedVehicles) {
      setSelectedVehicle(selectedVehicles)
    }
  }, [selectedVehicles])

  const addToPreview = (vehicle) => {
    setSelectedVehicle((prev) => {
      const exists = prev.some((s) => s.Vehicle?.id === vehicle.id)
      if (exists) {
        console.log("vehicle already exists! Not adding.")
        return prev
      }
      return [...prev, { Vehicle: vehicle }]
    })
  }

  const removeFromPreview = (id) => {
    setSelectedVehicle((prev) => prev.filter((vehicle) => vehicle.Vehicle?.id !== id))
  }

  const filteredVehicles = Vehicles.filter((vehicle) => {
    const query = searchQuery.toLowerCase()
    return vehicle.name.toLowerCase().includes(query) || vehicle.status.toLowerCase().includes(query)
  })

  const handleSave = async () => {
    try {
      // Use selectedVehicles (from API) for original IDs
      const originalVehicleIds = selectedVehicles.filter((vehicle) => vehicle.id).map((vehicle) => vehicle.id)

      // Use selectedVehicle (component state) for current IDs
      const currentVehicleIds = selectedVehicle.filter((vehicle) => vehicle.id).map((vehicle) => vehicle.id)

      // Find IDs that exist in original but not in current - these need to be deleted
      const vehicleIdsToDelete = originalVehicleIds.filter((id) => !currentVehicleIds.includes(id))

      console.log("Original vehicle IDs:", originalVehicleIds)
      console.log("Current vehicle IDs:", currentVehicleIds)
      console.log("Vehicle IDs to delete:", vehicleIdsToDelete)

      const deleteRequests = vehicleIdsToDelete.map((id) => {
        return axios
          .delete(`http://localhost:8383/all/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          })
          .catch((error) => {
            console.error(`Failed to delete vehicle assignment with ID ${id}:`, error)
            return { status: 500, error }
          })
      })

      const addRequests = selectedVehicle
        .filter((vehicle) => vehicle.Vehicle?.id)
        .map((vehicle) => {
          const payload = {
            siteoperationtypesId: id,
            staffId: vehicle.Staff ? vehicle.Staff.id : null,
            vehicleId: vehicle.Vehicle.id,
          }

          console.log("Payload to send:", payload)

          return axios
            .post("http://localhost:8383/all/add", payload, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              return { success: true, data: response.data }
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.error.includes("already exists")
              ) {
                console.log("Skipping duplicate:", payload)
                return { success: true, skipped: true }
              }

              return { success: false, error: error }
            })
        })
      const allResults = await Promise.all([...deleteRequests, ...addRequests])

      const errors = allResults.filter((result) => result.status === 500 || result.success === false)

      if (errors.length === 0) {
        setClickStatus(false)
        refetchdata()

        console.log(
          `Vehicle updated successfully: ${vehicleIdsToDelete.length} deleted, ${addRequests.length} added/updated.`,
        )
      } else {
        throw new Error(`${errors.length} requests failed.`)
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      alert(`Failed to update vehicle. Error: ${error.message}`)
    }
  }

  return (
    <>
      <div className="bgBlur"></div>
      <div className="entryContainer homeAddContainer">
        <div className="modelTitle">
          <h4>
            {selectedVehicle[0]?.SiteOperationtype?.Site?.name ? selectedVehicle[0]?.SiteOperationtype?.Site?.name : ""}
          </h4>
          {console.log(selectedVehicle)}
        </div>

        <div className="modelContent">
          <div className="current">
            {/* <div className="searchBox"></div> */}
            <div className="singleAddContainer">
              {selectedVehicle
                .filter((vehicle) => vehicle.Vehicle)
                .map((vehicle) => {
                  const groupId = vehicle?.Vehicle?.groupId
                  const group = Groups?.find((g) => g.id === groupId) || {}

                  return (
                    <div
                      key={vehicle.Vehicle?.id}
                      className="singleAddData"
                      style={{
                        borderLeft: `5px solid ${group.color || "gray"}`,
                      }}
                    >
                      <div className="flexRow">
                        <img
                          src={vehicle.Vehicle?.image || "/default-avatar.png"}
                          alt={vehicle.Vehicle?.Group?.name}
                          width="30px"
                          height="30px"
                          style={{ borderRadius: "50%" }}
                        />
                        <div className="data">
                          <p className="staffName">{vehicle.Vehicle?.name}</p>
                          <p className="staffPosition">{vehicle.Vehicle?.Group?.name}</p>
                        </div>
                      </div>
                      <div className="close">
                        <svg
                          onClick={() => removeFromPreview(vehicle.Vehicle?.id)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            d="M16 1L1 16M1 1L16 16"
                            stroke="#FF7B04"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <div className="new">
            <Search searchQuery={searchQuery} onSearch={setSearchQuery} />

            <div className="singleAddContainer">
              {filteredVehicles
                .filter((vehicle) => vehicle && vehicle.name)
                .map((vehicle) => {
                  const group = Groups?.find((group) => group.id === vehicle.groupId) || {}

                  const isSelected = selectedVehicle.some((v) => v.Vehicle?.id === vehicle.id)

                  return (
                    <div
                      key={vehicle.id}
                      className={`singleAddData ${isSelected ? "disabled" : ""}`}
                      style={{
                        borderLeft: `5px solid ${group.color || "gray"}`,
                        cursor: isSelected ? "not-allowed" : "pointer",
                        opacity: isSelected ? 0.5 : 1,
                      }}
                      onClick={() => !isSelected && addToPreview(vehicle)}
                    >
                      <div className="flexRow">
                        <img
                          src={vehicle.image || "/default-avatar.png"}
                          alt={vehicle.name || ""}
                          width="30px"
                          height="30px"
                          style={{ borderRadius: "50%" }}
                        />
                        <div className="data">
                          {vehicle.name && <p className="staffName">{vehicle.name}</p>}
                          {vehicle.Group?.name && <small className="staffPosition">{vehicle.Group?.name}</small>}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        <div className="btnGp">
          <button type="button" onClick={handleCancel} className="cancelBtn">
            Cancel
          </button>
          <button className="saveBtn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  )
}
