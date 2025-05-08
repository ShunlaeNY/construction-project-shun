import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../HOC/searchAndFilter/Search";
import { useFetchData } from "../HOC/UseFetchData";
import { useCRUD } from "../HOC/UseCRUD";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Filter from "../HOC/searchAndFilter/Filter";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import Entry from "./Entry";
import Column from "./Column/Column";
import "./list.scss";
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
    data: siteList,
    loading,
    error,
    refetch: refetchSiteList,
  } = useFetchData("http://localhost:8383/site/list", deleteStatus);
  console.log(siteList);

  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

  const [businessPartners, setBusinessPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModelBox, setShowCreateModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [showFitlerBox, setShowFitlerBox] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else {
      refetchSiteList();
    }
  }, [navigate]);

  useEffect(() => {
    if (siteList) {
      setSites(siteList);
    }
  }, [siteList]);

   // statuss
      useEffect(() => {
        const statuses = [...new Set(sites.map((s) => s.status))]
        setUniqueStatuses(statuses)
      }, [sites])

  //search
  useEffect(() => {
    const filtered = sites.filter((s) => {
      const query = searchQuery.toLowerCase();
      return [
        "name",
        "address",
        "startDate",
        "endDate",
        "status",
        "Businesspartner.name",
        "Staff.name",
      ].some((key) => {
        const keys = key.split(".");
        let value = s;
        for (let k of keys) {
          value = value ? value[k] : "";
        }
        return value?.toString().toLowerCase().includes(query);
      });
    });
    setFilteredSites(filtered);
  }, [sites, searchQuery]);

  // Restrict drag behavior
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Prevent accidental drags
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sites.findIndex((item) => item.id === active.id);
    const newIndex = sites.findIndex((item) => item.id === over.id);

    // Restrict dropping outside visible area
    if (newIndex < 0 || newIndex >= sites.length) return;

    const updatedStaffs = arrayMove(sites, oldIndex, newIndex);
    setSites(updatedStaffs);
  };

  const sortSites = (key, isDate = false) => {
    setSites((prevSites) => {
      return [...prevSites].sort((a, b) => {
        const keys = key.split("."); // Split the key if it's a nested property
        const valA = keys.reduce((acc, k) => (acc ? acc[k] : ""), a);
        const valB = keys.reduce((acc, k) => (acc ? acc[k] : ""), b);

        // Handle sorting for dates or other values
        if (isDate) {
          return new Date(valA) - new Date(valB);
        }
        return valA && valB ? valA.localeCompare(valB) : 0; // Handles null/undefined values
      });
    });
  };

  const handleCreateModelBox = () => {
    setShowCreateModelBox(true);
    console.log("Testing CreateModelBox");
    setSelectedTaskId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleFilterModelBox = () => setShowFitlerBox((prev) => !prev);
  const handleDownloadExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Format the data for Excel
    const formattedData = filteredSites.map((site) => {
      // Format dates for better readability in Excel
      const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : dateString
      }

      return {
        "Site Name": site.name,
        "Business Partner": site.Businesspartner?.name || "",
        "Company Representative": site.Staff?.name || "",
        Address: site.address || "",
        "Start Date": formatDate(site.startDate),
        "End Date": formatDate(site.endDate),
        Status: site.status || "",
      }
    })

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Site List")

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, "site_list.xlsx")
  }
  return (
    <>
      <div className="container">
        <section className="searchAndFilter">
          <Search searchQuery={searchQuery} onSearch={setSearchQuery} />
          <div className="filterContainer">
            <div className="filter buttonOne" onClick={handleFilterModelBox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 28 28"
                fill="currentColor"
              >
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
          <div className="siteHeader">
            <div></div>

            <div>
              <p>Site Name</p>
              <svg
                onClick={() => sortSites("name")}
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
              <p>Business Partner Name</p>
              <svg
                onClick={() => sortSites("Businesspartner.name")}
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
              <p>Company Representative</p>
              <svg
                onClick={() => sortSites("Staff.name")}
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
              <p>Schedule Period</p>
              <svg
                onClick={() => sortSites("startDate")}
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
                onClick={() => sortSites("status")}
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
                items={filteredSites}
                strategy={verticalListSortingStrategy}
              >
                {filteredSites.length === 0 ? (
                  <p>No Site found.</p>
                ) : (
                  <Column
                    tasks={filteredSites}
                    refetchSiteList={refetchSiteList}
                  />
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
          onSuccess={refetchSiteList}
        />
      )}
    </>
  );
}
