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
import Entry from "./Entry";
import Column from "./Column/Column";
import "../../../assets/styles/list.scss";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import * as XLSX from "xlsx";
export default function List(params) {
  const {
    handleDelete,
    loading: crudLoading,
    error: crudError,
    deleteStatus,
    refetch
  } = useCRUD();
  const {
    data: operationtypes,
    loading,
    error,
    refetch: refetchOperationTypes,
  } = useFetchData("http://localhost:8383/operationtypes/list", deleteStatus);

  const [operationTypes, setOperationTypes] = useState([]);
  const [filteredOperationTypes,setFilteredOperationTypes] = useState([])
  const [siteCounts,setSiteCounts] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  const [showCreateModelBox, setShowCreateModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Updated siteCounts:", siteCounts);
  // }, [siteCounts]);
  
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if(!token){
      navigate("/login")
    }
    else{
      refetchOperationTypes()
    }
  },[navigate])
  
  useEffect(() => {
    if (operationtypes) {  
      setOperationTypes(operationtypes);
      fetchSiteOperationsCount(operationtypes);
    }
  }, [operationtypes]);

    // search
    useEffect(() => {
      const filtered = operationTypes.filter((o) => {
        const query = searchQuery.toLowerCase()
        return (
          ["name"].some((key) => o[key]?.toString().toLowerCase().includes(query)) ||
          // String(siteCounts[o.id] || 0).includes(query)
          (siteCounts[o.id] !== undefined && siteCounts[o.id].toString().includes(query))
        )
      })
      setFilteredOperationTypes(filtered)
    }, [operationTypes, searchQuery,siteCounts])
  
  // const fetchSiteOperationsCount = async (operationTypes) => {
  //   try { 
  //     const countPromises = operationTypes.map((o) =>
  //       axios.get(`http://localhost:8383/siteoperation/getbyoperationtypeid/${o.id}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           "Content-Type": "application/json",
  //         },
  //       })
  //     );
  
  //     const countResponses = await Promise.all(countPromises);
  
  //     const projectCountMap = countResponses.reduce((acc, response, index) => {
  //       acc[operationTypes[index].id] = response.data.length || 0;
  //       return acc;
  //     }, {});
  
  //     setSiteCounts(projectCountMap);
  //     console.log(siteCounts);
  //   } catch (error) {
  //     console.error("Error fetching project counts:", error);
  //   }
  // };
  const fetchSiteOperationsCount = async (operationTypes) => {
    try {
      const countPromises = operationTypes.map((o) =>
        axios.get(`http://localhost:8383/siteoperation/getbyoperationtypeid/${o.id}`, {
          headers: {
            "otmm-api-key": "KoaderMasters",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
      );
  
      const countResponses = await Promise.all(countPromises);
  
      const projectCountMap = countResponses.reduce((acc, response, index) => {
        acc[operationTypes[index].id] = response.data.length || 0;
        return acc;
      }, {});
  
      setSiteCounts(projectCountMap);
      return projectCountMap; 
    } catch (error) {
      console.error("Error fetching project counts:", error);
      return {};
    }
  };
  


    // Restrict drag behavior
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }, // Prevent accidental drags
      })
    );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = operationTypes.findIndex((item) => item.id === active.id);
    const newIndex = operationTypes.findIndex((item) => item.id === over.id);

    const updatedOperationTypes = arrayMove(operationTypes, oldIndex, newIndex);
    setOperationTypes(updatedOperationTypes);
  };

  // const sortOperationTypes = (key, isDate = false) => {
  //   setOperationTypes((prevOperationTypes) => {
  //     return [...prevOperationTypes].sort((a, b) => {
  //       const valA = a[key] || "";
  //       const valB = b[key] || "";
  //       return isDate
  //         ? new Date(valA) - new Date(valB)
  //         : valA.localeCompare(valB);
  //     });
  //   });
  // };
  const sortOperationTypes = (key, isNumeric = false) => {
    setOperationTypes((prev) => {
      return [...prev].sort((a, b) => {
        if (isNumeric) {
          return (Number(a[key]) || 0) - (Number(b[key]) || 0);
        }
        return a[key]?.toString().localeCompare(b[key]?.toString());
      });
    });
  };
  

  const handleCreateModelBox = () => {
    setShowCreateModelBox(true);
    // console.log("Testing CreateModelBox");
    // setSelectedTaskId(null);
  };

  const handleDownloadExcel = async () => {
    const latestSiteCounts = await fetchSiteOperationsCount(filteredOperationTypes);
  
    console.log(latestSiteCounts);
    const workbook = XLSX.utils.book_new();
    const formattedData = filteredOperationTypes.map((operationType) => ({
      "Operation Type Name": operationType.name || "",
      "Number of Sites Used": latestSiteCounts[operationType.id] || 0,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operation Types");
    XLSX.writeFile(workbook, "operation_types.xlsx");
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container">
        <section className="searchAndFilter">
          <Search searchQuery={searchQuery} onSearch={setSearchQuery} />
          <div className="filterContainer">
            <div className="download buttonOne" onClick={handleDownloadExcel}>
              <svg 
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
          <div className="operationTypeListHeader">
            <div></div>
            <div>
              <p>Operation Type Name</p>
              <svg
                onClick={() => sortOperationTypes("name")}
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
              <p>Number of Sites Used</p>
              <svg
                onClick={() => sortOperationTypes("color")}
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
                items={filteredOperationTypes}
                strategy={verticalListSortingStrategy}
              >
                {filteredOperationTypes.length === 0 ? (
                  <p>No Operation Types found.</p>
                ):(
                  <Column tasks={filteredOperationTypes} refetchOperationTypes={refetchOperationTypes}/>
                )}
              </SortableContext>
            </DndContext>
          </div>
        </section>
      </div>
      {/* {showCreateModelBox && <Entry />} */}
      {showCreateModelBox && (
        <Entry
          showCreateModelBox={showCreateModelBox}
          setShowCreateModelBox={setShowCreateModelBox}
          onSuccess={refetchOperationTypes}
        />
      )}
    </>
  );
}
