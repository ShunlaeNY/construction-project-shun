import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../assets/styles/buttons/btnModalBox.scss";
import HomeDate from "../HOC/buttons/HomeDate";
import "./Home.scss";
import { useFetchData } from "../HOC/UseFetchData";
import { useCRUD } from "../HOC/UseCRUD";
import OperationListGrouped from "./OperationListGrouped";
import Entry from "../site/Entry";
import Edit from "../site/Edit";
import dayjs from "dayjs";
import axios from "axios";

export default function Home() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [siteOperationData, setSiteoperationData] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const navigate = useNavigate();

  const { deleteStatus } = useCRUD();
  const { data: allList, refetch: refetchAllList } = useFetchData(
    "http://localhost:8383/all/list",
    deleteStatus
  );

  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
    view: "month",
  });

  const memoizedDateRange = useMemo(() => dateRange, [dateRange]);
  const currentView = memoizedDateRange.view;
  const startDate = memoizedDateRange.startDate;
  const endDate = memoizedDateRange.endDate;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/login");
    else refetchAllList();
  }, [navigate]);

  const handleDateRangeChange = (start, end, view) => {
    setDateRange((prev) => {
      if (
        prev.startDate.isSame(start) &&
        prev.endDate.isSame(end) &&
        prev.view === view
      )
        return prev;
      return { startDate: start, endDate: end, view };
    });
  };

  useEffect(() => {
    if (!allList?.length) return;

    const filtered = allList.filter((data) => {
      const operationDetail = data.SiteOperationtype;
      // console.log(operationDetail);
      if (!operationDetail.startDate || !operationDetail.endDate) return false;

      const opStart = dayjs(operationDetail.startDate);
      const opEnd = dayjs(operationDetail.endDate);

      return (
        (opStart.isBefore(endDate) || opStart.isSame(endDate, "day")) &&
        (opEnd.isAfter(startDate) || opEnd.isSame(startDate, "day"))
      );
    });
    setFilteredOperations(filtered);
  }, [allList, startDate, endDate]);

  useEffect(() => {
    const daysArray = [];
    let current = startDate.clone();
    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      daysArray.push({
        date: current,
        dayOfMonth: current.date(),
        weekday: current.format("dd"),
        isToday: current.isSame(dayjs(), "day"),
      });
      current = current.add(1, "day");
    }
    setCalendarDays(daysArray);
  }, [startDate, endDate]);

  const [showCreateModelBox, setShowCreateModelBox] = useState(false);
  const handleCreateModelBox = () => setShowCreateModelBox(true);

  const [showEditModelBox, setShowEditModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleEditModelBox = (id) => {
    setSelectedTaskId(id);
    setShowEditModelBox(true);
  };

  const closeModal = () => {
    setShowEditModelBox(false);
    setSelectedTaskId(null);
  };

  return (
    <div>
      <section className="dateFilterSection">
        <HomeDate onDateRangeChange={handleDateRangeChange} />
        <button className="createNewBtn" onClick={handleCreateModelBox}>
          + New Site
        </button>
      </section>

      <section className="allDetailsSection">
        <div className="allDetails">
          {filteredOperations.length === 0 ? (
            <div style={{width:"100%"}}>
              <p className="no-data-message" style={{textAlign:"center"}}>No Site Operation Found for {startDate.format("MMM DD, YYYY")} - {endDate.format("MMM DD, YYYY")}</p>
            </div>
          ) : (
            <OperationListGrouped filteredOperations={filteredOperations} handleEditModelBox={handleEditModelBox} />
          )}
        </div>
      </section>

      {showCreateModelBox && (
        <Entry
          showCreateModelBox={showCreateModelBox}
          setShowCreateModelBox={setShowCreateModelBox}
          onSuccess={refetchAllList}
        />
      )}

      {showEditModelBox && selectedTaskId && (
        <Edit
          showEditModelBox={showEditModelBox}
          setShowEditModelBox={setShowEditModelBox}
          id={selectedTaskId}
          closeModal={closeModal}
          onSuccess={refetchAllList}
          setSiteoperationData={setSiteoperationData}
        />
      )}
    </div>
  );
}


