import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useFetchData } from "../../../HOC/UseFetchData"
import { useEffect, useState } from "react"

export const Task = ({ id, image, name, email, phonenumber, staffId, onClick, onSuccess }) => {
  const { attributes, listeners, setNodeRef, transition, transform } = useSortable({ id })

  const [staffName, setStaffName] = useState("")
  const [numberOfProjects, setNumberOfProjects] = useState(0)

  const { data: staffs } = useFetchData(`http://localhost:8383/staff/getbyid/${staffId}`)

  const { data: sites, loading: sitesLoading } = useFetchData(
    id ? `http://localhost:8383/site/getbybusinesspartnerid/${id}` : null,
  )

  useEffect(() => {
    if (staffs?.name) {
      setStaffName(staffs.name)
    }
  }, [staffs])

  useEffect(() => {
    if (sites && Array.isArray(sites)) {
      setNumberOfProjects(sites.length)
      console.log(`Business Partner ${id} has ${sites.length} projects`)
    }
  }, [sites, id])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="data">
      <div className="dragSortBtn" {...attributes} {...listeners}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 30 30" fill="none">
          <path
            d="M12.5 11.25C13.1904 11.25 13.75 10.6904 13.75 10C13.75 9.30964 13.1904 8.75 12.5 8.75C11.8096 8.75 11.25 9.30964 11.25 10C11.25 10.6904 11.8096 11.25 12.5 11.25Z"
            fill="#F27D14"
          />
          <path
            d="M12.5 21.25C13.1904 21.25 13.75 20.6904 13.75 20C13.75 19.3096 13.1904 18.75 12.5 18.75C11.8096 18.75 11.25 19.3096 11.25 20C11.25 20.6904 11.8096 21.25 12.5 21.25Z"
            fill="#F27D14"
          />
          <path
            d="M17.5 11.25C18.1904 11.25 18.75 10.6904 18.75 10C18.75 9.30964 18.1904 8.75 17.5 8.75C16.8096 8.75 16.25 9.30964 16.25 10C16.25 10.6904 16.8096 11.25 17.5 11.25Z"
            fill="#F27D14"
          />
          <path
            d="M17.5 21.25C18.1904 21.25 18.75 20.6904 18.75 20C18.75 19.3096 18.1904 18.75 17.5 18.75C16.8096 18.75 16.25 19.3096 16.25 20C16.25 20.6904 16.8096 21.25 17.5 21.25Z"
            fill="#F27D14"
          />
          <path
            d="M17.5 16.25C18.1904 16.25 18.75 15.6904 18.75 15C18.75 14.3096 18.1904 13.75 17.5 13.75C16.8096 13.75 16.25 14.3096 16.25 15C16.25 15.6904 16.8096 16.25 17.5 16.25Z"
            fill="#F27D14"
          />
          <path
            d="M12.5 16.25C13.1904 16.25 13.75 15.6904 13.75 15C13.75 14.3096 13.1904 13.75 12.5 13.75C11.8096 13.75 11.25 14.3096 11.25 15C11.25 15.6904 11.8096 16.25 12.5 16.25Z"
            fill="#F27D14"
          />
        </svg>
      </div>
      <img src={image || "/placeholder.svg"} width={30} height={30} alt={name || "Task"} />
      <p>{name}</p>
      <p>{email}</p>
      <p>{phonenumber}</p>
      <p>{sitesLoading ? "Loading..." : numberOfProjects}</p>
      <p>{staffName}</p>
      <div className="detailBtn" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 18 4" fill="currentColor">
          <path
            d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z"
            fill="#F27D14"
          />
        </svg>
      </div>
    </div>
  )
}


