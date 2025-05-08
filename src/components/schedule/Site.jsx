import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useFetchData } from "../HOC/UseFetchData"
import { useCRUD } from "../HOC/UseCRUD"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import "./staffschedule.scss"

export default function Site({ dateRange }) {
  const [selectedSite, setSelectedSite] = useState(null)
  const [clickDetails, setClickDetails] = useState(false)
  const modalRef = useRef(null)
  const [hasSchedulesInRange,setHasSchedulesInRange] = useState(false)

  const handleClickDetails = (siteId) => {
    setSelectedSite(siteId)
    setClickDetails(true)
  }

  const closeModal = () => {
    setClickDetails(false)
    setSelectedSite(null)
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }

    if (clickDetails) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [clickDetails])

  const [siteData, setSiteData] = useState({})
  const [siteNames, setSiteNames] = useState({})
  const [operationTypes, setOperationTypes] = useState({})
  const [operationDetails, setOperationDetails] = useState({})
  const [calendarDays, setCalendarDays] = useState([])
  const [filteredOperations, setFilteredOperations] = useState([])

  // Get the current view and date range from props or use defaults
  const currentView = dateRange?.view || "month"
  const startDate = dateRange?.startDate || dayjs().startOf("month")
  const endDate = dateRange?.endDate || dayjs().endOf("month")

  const { handleDelete, refetch, deleteStatus } = useCRUD()
  const {
    data: siteOperations,
    loading,
    error,
    refetch: refetchOperations,
  } = useFetchData(`http://localhost:8383/all/list`, deleteStatus)

  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken")

  // Redirect if not authenticated
  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
    } else {
      refetchOperations()
    }
  }, [accessToken, navigate, refetchOperations])

  // Filter operations based on date range
  useEffect(() => {
    if (!siteOperations?.length){
      setHasSchedulesInRange(false)
      return
    }
    const filtered = siteOperations.filter((operation) => {
      const operationDetail = operationDetails[operation.siteoperationtypesId] || {}

      // Skip if no operation details
      if (!operationDetail.startDate || !operationDetail.endDate) return false

      const opStartDate = dayjs(operationDetail.startDate)
      const opEndDate = dayjs(operationDetail.endDate)

      // Check if operation overlaps with selected date range
      return (
        (opStartDate.isBefore(endDate) || opStartDate.isSame(endDate, "day")) &&
        (opEndDate.isAfter(startDate) || opEndDate.isSame(startDate, "day"))
      )
    })

    setFilteredOperations(filtered)
    setHasSchedulesInRange(filtered.length > 0)
  }, [siteOperations, operationDetails, startDate, endDate])

  // Fetch site Details & Operation Type Name
  useEffect(() => {
    const fetchSiteDetails = async () => {
      if (!siteOperations?.length) return

      const uniqueSiteOperationsIds = [...new Set(siteOperations.map((item) => item.siteoperationtypesId))]

      try {
        const operationsData = await Promise.all(
          uniqueSiteOperationsIds.map(async (siteoperationtypesId) => {
            try {
              const response = await axios.get(`http://localhost:8383/siteoperation/getbyid/${siteoperationtypesId}`, {
                headers: {
                  "otmm-api-key": "KoaderMasters",
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              })

              return {
                siteoperationtypesId,
                operationtypesId: response.data.operationtypesId,
                startDate: response.data.startDate,
                endDate: response.data.endDate,
                siteId: response.data.siteId,
              }
            } catch (error) {
              console.error(`Error fetching site operation ${siteoperationtypesId}:`, error.response?.data || error)
              return {
                siteoperationtypesId,
                operationtypesId: "Unknown",
                startDate: "N/A",
                endDate: "N/A",
                siteId: null,
              }
            }
          }),
        )

        // Store operation details
        const operationDetailsMap = {}
        const uniqueSiteIds = []

        operationsData.forEach(({ siteoperationtypesId, startDate, endDate, siteId, operationtypesId }) => {
          operationDetailsMap[siteoperationtypesId] = {
            startDate,
            endDate,
            siteId,
            operationtypesId,
          }

          if (siteId && !uniqueSiteIds.includes(siteId)) {
            uniqueSiteIds.push(siteId)
          }
        })

        setOperationDetails(operationDetailsMap)

        // Fetch operation type names
        const uniqueOperationTypeIds = [
          ...new Set(operationsData.map((op) => op.operationtypesId).filter((id) => id !== "Unknown")),
        ]

        const operationTypeDetails = await Promise.all(
          uniqueOperationTypeIds.map(async (operationtypesId) => {
            try {
              const response = await axios.get(`http://localhost:8383/operationtypes/getbyid/${operationtypesId}`, {
                headers: {
                  "otmm-api-key": "KoaderMasters",
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              })
              return { operationtypesId, name: response.data.name, color: response.data.color }
            } catch (error) {
              console.error(`Error fetching operation type ${operationtypesId}:`, error.response?.data || error)
              return { operationtypesId, name: "Unknown Operation Type" }
            }
          }),
        )

        // Fetch site names
        if (uniqueSiteIds.length > 0) {
          const siteDetails = await Promise.all(
            uniqueSiteIds.map(async (siteId) => {
              try {
                const response = await axios.get(`http://localhost:8383/site/getbyid/${siteId}`, {
                  headers: {
                    "otmm-api-key": "KoaderMasters",
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                })

                return {
                  siteId,
                  name: response.data.name,
                  startDate: response.data.startDate,
                  endDate: response.data.endDate,
                  image: response.data.image || "fallback-site-image.jpg",
                  address: response.data.address || "No address available",
                  description: response.data.description || "No description available",
                  contact: response.data.contact || "No contact information",
                }
              } catch (error) {
                console.error(`Error fetching Site ${siteId}:`, error.response?.data || error)
                return {
                  siteId,
                  name: "Unknown Site",
                  image: "fallback-site-image.jpg",
                  address: "No address available",
                  description: "No description available",
                  contact: "No contact information",
                }
              }
            }),
          )

          // Store site names and data
          const siteNamesMap = {}
          const siteDataMap = {}

          siteDetails.forEach(({ siteId, name, startDate, endDate, image, address, description, contact }) => {
            siteNamesMap[siteId] = { name, startDate, endDate }
            siteDataMap[siteId] = { name, startDate, endDate, image, address, description, contact }
          })

          setSiteNames(siteNamesMap)
          setSiteData(siteDataMap)
        }

        // Store operation type names
        const operationTypeMap = {}
        operationTypeDetails.forEach(({ operationtypesId, name, color }) => {
          operationTypeMap[operationtypesId] = { name, color }
        })

        setOperationTypes(operationTypeMap)
      } catch (err) {
        console.error("Error fetching operation details:", err)
      }
    }

    fetchSiteDetails()
  }, [siteOperations, accessToken])

  // Generate calendar days based on current view and date range
  useEffect(() => {
    const daysArray = []
    let currentDay = startDate.clone()

    // Generate days until we reach the end date
    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, "day")) {
      daysArray.push({
        date: currentDay,
        dayOfMonth: currentDay.date(),
        weekday: currentDay.format("dd"),
        isToday: currentDay.isSame(dayjs(), "day"),
      })
      currentDay = currentDay.add(1, "day")
    }

    setCalendarDays(daysArray)
  }, [startDate, endDate, currentView])

  // Helper function to determine if a date falls within an operation's date range
  const isDateInRange = (date, startDate, endDate) => {
    if (!startDate || !endDate || startDate === "N/A" || endDate === "N/A") return false

    const checkDate = dayjs(date)
    const start = dayjs(startDate)
    const end = dayjs(endDate)

    return (
      (checkDate.isAfter(start) || checkDate.isSame(start, "day")) &&
      (checkDate.isBefore(end) || checkDate.isSame(end, "day"))
    )
  }

  const getSiteColor = (siteName) => {
    if (!siteName) return "#ff7b04"
    return "#ff7b04" // Default orange color
  }

  const getOperationtypesColor = (operationtypesId) => {
    return operationTypes[operationtypesId]?.color || "gray"
  }

  // Get display name for the operation
  const getOperationDisplayName = (operation) => {
    const operationDetail = operationDetails[operation.siteoperationtypesId] || {}
    const siteId = operationDetail.siteId
    const operationtypesId = operationDetail.operationtypesId

    const siteName = siteNames[siteId]?.name || "Unknown Site"
    const operationTypeName = operationTypes[operationtypesId]?.name || "Unknown Operation"

    return { siteName, operationTypeName, operationtypesId }
  }

  // Calculate grid column positions based on the current view and date range
  const calculateGridPosition = (date, view) => {
    if (!date || !date.isValid()) return null

    if (view === "month") {
      // For month view, use the day of month
      return date.date()
    } else if (view === "week") {
      // For week view, use the day of week (0-6) + 1
      return date.day() + 1
    }
    return null
  }

  	
  const sitesWithOperations =
    !loading && !error && siteOperations?.length > 0
      ? Object.entries(
          siteOperations.reduce((acc, operation) => {
            const operationDetail = operationDetails[operation.siteoperationtypesId] || {}
            const siteId = operationDetail.siteId
            if (!siteId) return acc
            if (!acc[siteId]) {
              acc[siteId] = []
            }
            acc[siteId].push(operation)
            return acc
          }, {}),
        ).filter(([siteId, operations]) => {
            const siteOperationsList = operations.filter((operation) => {
            const operationDetail = operationDetails[operation.siteoperationtypesId] || {}
            if (!operationDetail.startDate || !operationDetail.endDate) return false
            const opStartDate = dayjs(operationDetail.startDate)
            const opEndDate = dayjs(operationDetail.endDate)
            return (
              (opStartDate.isBefore(endDate) || opStartDate.isSame(endDate, "day")) &&
              (opEndDate.isAfter(startDate) || opEndDate.isSame(startDate, "day"))
            )
          })
          return siteOperationsList.length > 0
        })
      : []

  return (
    <div className="staff-schedule-container">
      {/* Site Schedule */}
      <div className="staff-schedule-content">
        {loading && <p className="loading-message">Loading site schedule...</p>}
        {error && <p className="error-message">Error fetching data</p>}

        {!loading && !error && sitesWithOperations?.length > 0
          ? 
              sitesWithOperations.map(([siteId, operations]) => {
              const site = siteData[siteId] || {}

              
              const siteOperationsList = operations.filter((operation) => {
                const operationDetail = operationDetails[operation.siteoperationtypesId] || {}
                if (!operationDetail.startDate || !operationDetail.endDate) return false

                const opStartDate = dayjs(operationDetail.startDate)
                const opEndDate = dayjs(operationDetail.endDate)

                return (
                  (opStartDate.isBefore(endDate) || opStartDate.isSame(endDate, "day")) &&
                  (opEndDate.isAfter(startDate) || opEndDate.isSame(startDate, "day"))
                )
              })

              const operationsByType = {}

              siteOperationsList.forEach((operation) => {
                const operationDetail = operationDetails[operation.siteoperationtypesId] || {}
                const operationtypesId = operationDetail.operationtypesId

                if (!operationtypesId) return

                if (!operationsByType[operationtypesId]) {
                  operationsByType[operationtypesId] = {
                    operations: [],
                    startDate: null,
                    endDate: null,
                    name: operationTypes[operationtypesId]?.name || "Unknown Operation",
                    color: operationTypes[operationtypesId]?.color || "gray",
                  }
                }

                operationsByType[operationtypesId].operations.push(operation)

                // Update date range for this operation type
                const opStartDate = dayjs(operationDetail.startDate)
                const opEndDate = dayjs(operationDetail.endDate)

                if (
                  !operationsByType[operationtypesId].startDate ||
                  opStartDate.isBefore(operationsByType[operationtypesId].startDate)
                ) {
                  operationsByType[operationtypesId].startDate = opStartDate
                }

                if (
                  !operationsByType[operationtypesId].endDate ||
                  opEndDate.isAfter(operationsByType[operationtypesId].endDate)
                ) {
                  operationsByType[operationtypesId].endDate = opEndDate
                }
              })

              return (
                <div key={siteId}>
                  <div className="staffRow" onClick={() => handleClickDetails(siteId)}>
                    <div className="staffInfo">
                      <div className="staffDetails">
                        <p className="staff-name">{site.name || "Loading..."}</p>
                        <small className="dateRange">
                          {site.startDate && site.endDate
                            ? `${dayjs(site.startDate).format("DD/MM/YYYY")} - ${dayjs(site.endDate).format("DD/MM/YYYY")}`
                            : "No dates available"}
                        </small>
                      </div>
                    </div>
                    <div
                      className="staffTimeline"
                      style={{
                        gridTemplateColumns: `repeat(${calendarDays.length +1}, 1fr)`,
                      }}
                    >
                      
                      {Object.entries(operationsByType).map(([operationtypesId, typeData]) => {
                        const {
                          startDate: opStartDate,
                          endDate: opEndDate,
                          name: operationTypeName,
                          color: operationtypesColor,
                        } = typeData

                        // Skip if invalid dates
                        if (!opStartDate || !opEndDate || !opStartDate.isValid() || !opEndDate.isValid()) {
                          return null
                        }

                        // Adjust dates to be within the visible range
                        const visibleOpStart = opStartDate.isBefore(startDate) ? startDate : opStartDate
                        const visibleOpEnd = opEndDate.isAfter(endDate) ? endDate : opEndDate

                        // Calculate positions relative to the visible calendar days
                        const opStartIndex = calendarDays.findIndex((day) => day.date.isSame(visibleOpStart, "day"))
                        const opEndIndex = calendarDays.findIndex((day) => day.date.isSame(visibleOpEnd, "day"))

                        // Skip if not visible in current range
                        if (opStartIndex === -1 || opEndIndex === -1) return null

                        // Calculate grid positions
                        const opStartColumn = opStartIndex + 1 // 1-based for grid
                        const opEndColumn = opEndIndex + 1
                        const opColumnSpan = opEndColumn - opStartColumn + 1

                        return (
                          <div
                            key={`operation-type-${operationtypesId}`}
                            className="Bar operationTypeBar"
                            style={{
                              gridColumn: `${opStartColumn} / span ${opColumnSpan}`,
                              backgroundColor: operationtypesColor,
                              height: "5px",
                              marginBottom: "15px",
                            }}
                          >
                            <span className="BarLabel operationLabel">{operationTypeName}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })
          : !loading && (
            <p className="no-data-message">
                No Schedule Found for {startDate.format("MMM DD, YYYY")} - {endDate.format("MMM DD, YYYY")}
              </p>
            )}          
      </div>

      {/* Modal Box */}
      {clickDetails && selectedSite && (
        <div className="modal-overlay">
          <div className="modal-container" ref={modalRef}>
            <div className="modal-header">
              <h2>Site Details</h2>
              <button className="closeButton" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="site-details">
                {/* <div className="site-image">
                  <img
                    src={siteData[selectedSite]?.image || "/fallback-site-image.jpg"}
                    alt={siteData[selectedSite]?.name || "Site"}
                  />
                </div> */}
                <div className="site-info">
                <div className="info-row flexRow">
                    <span className="info-label">Site Name:</span>
                    <span className="info-value">
                      {siteData[selectedSite]?.name}
                    </span>
                  </div>
                  <div className="info-row flexRow">
                    <span className="info-label">Schedule:</span>
                    <span className="info-value">
                      {siteData[selectedSite]?.startDate && siteData[selectedSite]?.endDate
                        ? `${dayjs(siteData[selectedSite].startDate).format("DD/MM/YYYY")} - ${dayjs(siteData[selectedSite].endDate).format("DD/MM/YYYY")}`
                        : "No dates available"}
                    </span>
                  </div>
                  <div className="info-row flexRow">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{siteData[selectedSite]?.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-button-text" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}

