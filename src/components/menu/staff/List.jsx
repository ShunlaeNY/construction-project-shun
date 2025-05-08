import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../../HOC/searchAndFilter/Search";
import { useFetchData } from "../../HOC/UseFetchData";
import { useCRUD } from "../../HOC/UseCRUD";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { closestCorners, DndContext, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import Entry from "./Entry";
import Column from "./Column/Column";
import "./list.scss";
import Filter from "../../HOC/searchAndFilter/Filter";
import * as XLSX from "xlsx";
export default function List(params) {
  const {
    handleDelete,
    loading: crudLoading,
    error: crudError,
    refetch,
    deleteStatus,
  } = useCRUD();
  const {
    data: Staffs,
    loading,
    error,
    refetch: refetchStaffs,
  } = useFetchData("http://localhost:8383/staff/list", deleteStatus);

  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [userTypesData, setUserTypesData] = useState({});

  const [searchQuery, setSearchQuery] = useState("")
  const [showFitlerBox, setShowFitlerBox] = useState(false)
  const [uniqueStatuses, setUniqueStatuses] = useState([])

  const [showCreateModelBox, setShowCreateModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("accessToken")
      if(!token){
        navigate("/login")
      }
      else{
        refetchStaffs()
      }
    },[navigate])

  useEffect(() => {
    if (Staffs) {
      setStaffs(Staffs)
      fetchTeamData(Staffs)
      fetchUserTypesData(Staffs)
    }
  }, [Staffs]);

    // statuss
    useEffect(() => {
      const statuses = [...new Set(staffs.map((v) => v.workingStatus))]
      setUniqueStatuses(statuses)
    }, [staffs])

      //search
  useEffect(() => {
    const filtered = staffs.filter((s) => {
      const query = searchQuery.toLowerCase()
      return (
        ["name", "email", "workingStatus"].some((key) => s[key]?.toString().toLowerCase().includes(query)) ||
        (teamData[s.teamId] || "").toLowerCase().includes(query) ||
        (userTypesData[s.usertypesId] || "").toLowerCase().includes(query)
      )
    })
    setFilteredStaffs(filtered)
  }, [staffs, searchQuery, teamData,userTypesData])

  
  const fetchTeamData = async (staffList) => {
      try {
        const teamIds = [...new Set(staffList.map((v) => v.teamId))]
        if (teamIds.length === 0) return
  
        const accessToken = localStorage.getItem("accessToken"); 
  
        const teamPromises = teamIds.map((id) =>
          axios.get(`http://localhost:8383/team/getbyid/${id}`, {
            headers: {
              "otmm-api-key": "KoaderMasters",
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
        );
  
  const teamResponses = await Promise.all(teamPromises)
        const teamDataMap = teamResponses.reduce((acc, response) => {
          if (response.data?.id) acc[response.data.id] = response.data.name
          return acc
        }, {})
        setTeamData(teamDataMap)
      } catch (error) {
        console.error("Error fetching Team data:", error)
      }
    }

    const fetchUserTypesData = async (staffList) => {
      try {
        const userTypesIds = [...new Set(staffList.map((v) => v.usertypesId))]
        if (userTypesIds.length === 0) return
  
        const accessToken = localStorage.getItem("accessToken"); 
  
        const usertypesPromises = userTypesIds.map((id) =>
          axios.get(`http://localhost:8383/usertypes/getbyid/${id}`, {
            headers: {
              "otmm-api-key": "KoaderMasters",
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
        );
  
        const usertypesResponses = await Promise.all(usertypesPromises)
        const usertypesDataMap = usertypesResponses.reduce((acc, response) => {
          if (response.data?.id) acc[response.data.id] = response.data.name
          return acc
        }, {})
        setUserTypesData(usertypesDataMap)
      } catch (error) {
        console.error("Error fetching UserTypes data:", error)
      }
    }

  // Restrict drag behavior
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Prevent accidental drags
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = staffs.findIndex((item) => item.id === active.id);
    const newIndex = staffs.findIndex((item) => item.id === over.id);

    // Restrict dropping outside visible area
    if (newIndex < 0 || newIndex >= staffs.length) return;

    const updatedStaffs = arrayMove(staffs, oldIndex, newIndex);
    setStaffs(updatedStaffs);
  };

  const sortStaffs = (key, isDate = false) => {
    setStaffs((prevStaffs) => {
      return [...prevStaffs].sort((a, b) => {
        const valA = a[key] || "";
        const valB = b[key] || "";
        return isDate
          ? new Date(valA) - new Date(valB)
          : valA.localeCompare(valB);
      });
    });
  };

    // sort not in db datas
    const sortTeamName = () => {
      if (Object.keys(teamData).length === 0) return // Ensure groupdata is populated
  
      setStaffs((prev) => {
        return [...prev].sort((a, b) => {
          const groupNameA = teamData[a.teamId] || ""
          const groupNameB = teamData[b.teamId] || ""
          return groupNameA.localeCompare(groupNameB)
        })
      })
    }

    const sortUserTypes = () => {
      if (Object.keys(userTypesData).length === 0) return // Ensure groupdata is populated
  
      setStaffs((prev) => {
        return [...prev].sort((a, b) => {
          const groupNameA = userTypesData[a.usertypesId] || ""
          const groupNameB = userTypesData[b.usertypesId] || ""
          return groupNameA.localeCompare(groupNameB)
        })
      })
    }

  const handleCreateModelBox = () => {
    setShowCreateModelBox(true)
  }

  const handleFilterModelBox = () => setShowFitlerBox((prev) => !prev)

  		
  const handleDownloadExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Format the data for Excel
    const formattedData = filteredStaffs.map(staff => ({
      'Name': staff.name,
      'Email': staff.email,
      'Team': teamData[staff.teamId] || '',
      'Staff Type': userTypesData[staff.usertypesId] || '',
      'Status': staff.workingStatus
    }));
    
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff List');
    
    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, 'staff_list.xlsx');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container">
        <section className="searchAndFilter">
          <Search searchQuery={searchQuery} onSearch={setSearchQuery} />
          <div className="filterContainer">
            <div className="filter buttonOne" onClick={handleFilterModelBox}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 28 28" fill="currentColor">
                            <path
                              d="M17.5002 5.83338C17.8096 5.83338 18.1063 5.9563 18.3251 6.17509C18.5439 6.39389 18.6668 6.69063 18.6668 7.00005C18.6668 7.30947 18.5439 7.60622 18.3251 7.82501C18.1063 8.0438 17.8096 8.16672 17.5002 8.16672C17.1907 8.16672 16.894 8.0438 16.6752 7.82501C16.4564 7.60622 16.3335 7.30947 16.3335 7.00005C16.3335 6.69063 16.4564 6.39389 16.6752 6.17509C16.894 5.9563 17.1907 5.83338 17.5002 5.83338ZM20.8018 5.83338C20.5608 5.15026 20.1138 4.55872 19.5225 4.14031C18.9311 3.72189 18.2246 3.49719 17.5002 3.49719C16.7758 3.49719 16.0692 3.72189 15.4779 4.14031C14.8865 4.55872 14.4395 5.15026 14.1985 5.83338H5.8335C5.52408 5.83338 5.22733 5.9563 5.00854 6.17509C4.78975 6.39389 4.66683 6.69063 4.66683 7.00005C4.66683 7.30947 4.78975 7.60622 5.00854 7.82501C5.22733 8.0438 5.52408 8.16672 5.8335 8.16672H14.1985C14.4395 8.84984 14.8865 9.44138 15.4779 9.8598C16.0692 10.2782 16.7758 10.5029 17.5002 10.5029C18.2246 10.5029 18.9311 10.2782 19.5225 9.8598C20.1138 9.44138 20.5608 8.84984 20.8018 8.16672H22.1668C22.4762 8.16672 22.773 8.0438 22.9918 7.82501C23.2106 7.60622 23.3335 7.30947 23.3335 7.00005C23.3335 6.69063 23.2106 6.39389 22.9918 6.17509C22.773 5.9563 22.4762 5.83338 22.1668 5.83338H20.8018ZM10.5002 12.8334C10.8096 12.8334 11.1063 12.9563 11.3251 13.1751C11.5439 13.3939 11.6668 13.6906 11.6668 14.0001C11.6668 14.3095 11.5439 14.6062 11.3251 14.825C11.1063 15.0438 10.8096 15.1667 10.5002 15.1667C10.1907 15.1667 9.894 15.0438 9.67521 14.825C9.45641 14.6062 9.3335 14.3095 9.3335 14.0001C9.3335 13.6906 9.45641 13.3939 9.67521 13.1751C9.894 12.9563 10.1907 12.8334 10.5002 12.8334ZM13.8018 12.8334C13.5608 12.1503 13.1138 11.5587 12.5225 11.1403C11.9311 10.7219 11.2246 10.4972 10.5002 10.4972C9.77576 10.4972 9.0692 10.7219 8.47786 11.1403C7.88653 11.5587 7.43953 12.1503 7.1985 12.8334H5.8335C5.52408 12.8334 5.22733 12.9563 5.00854 13.1751C4.78975 13.3939 4.66683 13.6906 4.66683 14.0001C4.66683 14.3095 4.78975 14.6062 5.00854 14.825C5.22733 15.0438 5.52408 15.1667 5.8335 15.1667H7.1985C7.43953 15.8498 7.88653 16.4414 8.47786 16.8598C9.0692 17.2782 9.77576 17.5029 10.5002 17.5029C11.2246 17.5029 11.9311 17.2782 12.5225 16.8598C13.1138 16.4414 13.5608 15.8498 13.8018 15.1667H22.1668C22.4762 15.1667 22.773 15.0438 22.9918 14.825C23.2106 14.6062 23.3335 14.3095 23.3335 14.0001C23.3335 13.6906 23.2106 13.3939 22.9918 13.1751C22.773 12.9563 22.4762 12.8334 22.1668 12.8334H13.8018ZM17.5002 19.8334C17.8096 19.8334 18.1063 19.9563 18.3251 20.1751C18.5439 20.3939 18.6668 20.6906 18.6668 21.0001C18.6668 21.3095 18.5439 21.6062 18.3251 21.825C18.1063 22.0438 17.8096 22.1667 17.5002 22.1667C17.1907 22.1667 16.894 22.0438 16.6752 21.825C16.4564 21.6062 16.3335 21.3095 16.3335 21.0001C16.3335 20.6906 16.4564 20.3939 16.6752 20.1751C16.894 19.9563 17.1907 19.8334 17.5002 19.8334ZM20.8018 19.8334C20.5608 19.1503 20.1138 18.5587 19.5225 18.1403C18.9311 17.7219 18.2246 17.4972 17.5002 17.4972C16.7758 17.4972 16.0692 17.7219 15.4779 18.1403C14.8865 18.5587 14.4395 19.1503 14.1985 19.8334H5.8335C5.52408 19.8334 5.22733 19.9563 5.00854 20.1751C4.78975 20.3939 4.66683 20.6906 4.66683 21.0001C4.66683 21.3095 4.78975 21.6062 5.00854 21.825C5.22733 22.0438 5.52408 22.1667 5.8335 22.1667H14.1985C14.4395 22.8498 14.8865 23.4414 15.4779 23.8598C16.0692 24.2782 16.7758 24.5029 17.5002 24.5029C18.2246 24.5029 18.9311 24.2782 19.5225 23.8598C20.1138 23.4414 20.5608 22.8498 20.8018 22.1667H22.1668C22.4762 22.1667 22.773 22.0438 22.9918 21.825C23.2106 21.6062 23.3335 21.3095 23.3335 21.0001C23.3335 20.6906 23.2106 20.3939 22.9918 20.1751C22.773 19.9563 22.4762 19.8334 22.1668 19.8334H20.8018Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        {showFitlerBox && (
                          <Filter
                            uniqueStatuses={uniqueStatuses}
                            onSelect={(status) => setSearchQuery(status)}
                            isVisible={showFitlerBox}
                          />
                        )}
            <div className="download buttonOne">
              <svg onClick={handleDownloadExcel}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 16L17 11L15.6 9.55L13 12.15V4H11V12.15L8.4 9.55L7 11L12 16ZM18 20C18.55 20 19.0207 19.8043 19.412 19.413C19.8033 19.0217 19.9993 18.5507 20 18V15H18V18H6V15H4V18C4 18.55 4.19567 19.021 4.587 19.413C4.97833 19.805 5.44933 20.0007 6 20H18Z" />
              </svg>
            </div>
            <button className="createNewBtn" onClick={handleCreateModelBox}>
              + Create New
            </button>
          </div>
        </section>

        <section className="list">
          <div className="staffHeader">
            <div></div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M0.562477 15.6125C0.582222 15.9077 0.608208 16.1809 0.642405 16.4349C0.781563 17.4686 1.0484 18.1099 1.52571 18.5876C2.00279 19.0651 2.64385 19.3319 3.67765 19.471C4.72582 19.6119 6.10036 19.613 8 19.613H12C13.8996 19.613 15.2739 19.6117 16.3219 19.4706C17.3556 19.3314 17.9969 19.0646 18.4746 18.5873C18.9521 18.1102 19.2189 17.4691 19.358 16.4354C19.4989 15.3872 19.5 14.0126 19.5 12.113V8.113C19.5 6.21336 19.4989 4.83882 19.358 3.79065C19.2817 3.22343 19.1669 2.77445 19 2.4059V13.613V14.8201L18.1464 13.9666L16.2366 12.0567C16.2365 12.0566 16.2365 12.0566 16.2364 12.0566C15.5552 11.3759 15.073 10.8946 14.6715 10.5713C14.2724 10.2499 14.0175 10.1396 13.8006 10.1212C13.5254 10.098 13.249 10.1512 13.0021 10.275C12.8076 10.3725 12.6119 10.5694 12.3608 11.0159C12.1082 11.465 11.8392 12.0913 11.4596 12.977L11.4068 13.1005L11.4064 13.1014L11.3939 13.1304C11.24 13.4888 11.1105 13.7901 10.9849 14.0205C10.8551 14.2584 10.6963 14.4859 10.4523 14.6371L10.4517 14.6374C10.1387 14.8307 9.76554 14.9023 9.40322 14.8384L0.562477 15.6125ZM0.562477 15.6125C1.08226 15.6047 1.59607 15.4986 2.07671 15.2996C2.57663 15.0926 3.03088 14.7891 3.41352 14.4066L3.41355 14.4066L4.16555 13.6546C4.53187 13.2882 4.78718 13.0334 5.00115 12.8491C5.21118 12.6683 5.35149 12.5824 5.47718 12.5357L5.47725 12.5357C5.81447 12.4103 6.18553 12.4103 6.52275 12.5357L6.52282 12.5357C6.64864 12.5824 6.78925 12.6684 6.9991 12.8491C7.21283 13.0332 7.4679 13.288 7.83296 13.6541L7.835 13.6561L7.83501 13.6561L7.94745 13.7676L7.94901 13.7691L0.562477 15.6125Z"
                  fill="black"
                  stroke="white"
                />
                <path
                  d="M19 8.11304C19 6.19904 18.998 4.86404 18.862 3.85704C18.731 2.87904 18.49 2.36104 18.122 1.99204C17.752 1.62204 17.234 1.38204 16.256 1.25104C15.249 1.11504 13.914 1.11304 12 1.11304H8C6.086 1.11304 4.751 1.11504 3.744 1.25104C2.766 1.38204 2.248 1.62304 1.879 1.99104C1.509 2.36104 1.269 2.87904 1.137 3.85704C1.002 4.86404 1 6.19904 1 8.11304V12.113C1 14.027 1.002 15.362 1.137 16.369C1.269 17.347 1.51 17.865 1.879 18.234C2.248 18.604 2.766 18.844 3.744 18.976C4.751 19.111 6.086 19.113 8 19.113H12C13.914 19.113 15.249 19.111 16.256 18.976C17.234 18.844 17.752 18.603 18.121 18.234C18.491 17.865 18.731 17.347 18.862 16.369C18.998 15.362 19 14.027 19 12.113V8.11304Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M5.5 7.11304C5.5 7.94146 6.17157 8.61304 7 8.61304C7.82843 8.61304 8.5 7.94146 8.5 7.11304C8.5 6.28461 7.82843 5.61304 7 5.61304C6.17157 5.61304 5.5 6.28461 5.5 7.11304Z"
                  fill="black"
                  stroke="white"
                />
              </svg>
            </div>
            <div>
              <p>Staff Name</p>
              <svg
                onClick={() => sortStaffs("name")}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 21 24"
                fill="currentColor"
              >
                <path
                  d="M10.4587 21L14.3809 14.5H6.5365L10.4587 21ZM10.4587 3L14.3809 9.5H6.5365L10.4587 3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p>Email</p>
              <svg
                onClick={() => sortStaffs("email")}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 21 24"
                fill="currentColor"
              >
                <path
                  d="M10.4587 21L14.3809 14.5H6.5365L10.4587 21ZM10.4587 3L14.3809 9.5H6.5365L10.4587 3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p>Team</p>
              <svg
                onClick={sortTeamName}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 21 24"
                fill="currentColor"
              >
                <path
                  d="M10.4587 21L14.3809 14.5H6.5365L10.4587 21ZM10.4587 3L14.3809 9.5H6.5365L10.4587 3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p>Staff Type</p>
              <svg
                onClick={sortUserTypes}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 21 24"
                fill="currentColor"
              >
                <path
                  d="M10.4587 21L14.3809 14.5H6.5365L10.4587 21ZM10.4587 3L14.3809 9.5H6.5365L10.4587 3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p>Status</p>
              <svg
                onClick={() => sortStaffs("workingStatus")}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 21 24"
                fill="currentColor"
              >
                <path
                  d="M10.4587 21L14.3809 14.5H6.5365L10.4587 21ZM10.4587 3L14.3809 9.5H6.5365L10.4587 3Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div></div>
          </div>
          <div className="droppable-area">
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              collisionDetection={rectIntersection}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={filteredStaffs}
                strategy={verticalListSortingStrategy}
              >
                {filteredStaffs.length === 0 ?(
                  <p>No Staff found.</p>
                ) :(
                  <Column tasks={filteredStaffs} refetchStaffs={refetchStaffs}/>
                )}
              </SortableContext>
            </DndContext>
          </div>
        </section>
      </div>
      {showCreateModelBox && (
        <Entry
          showCreateModelBox={showCreateModelBox}
          setShowCreateModelBox={setShowCreateModelBox}
          onSuccess={refetchStaffs}
        />
      )}
    </>
  );
}
