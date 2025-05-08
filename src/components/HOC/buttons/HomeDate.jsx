import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import "../../../assets/styles/buttons/homeDate.scss";
import { endOfDay } from "date-fns";

// Extend dayjs with plugins
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const HomeDate = ({onDateRangeChange,initialView = "day", initialDate = dayjs()}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(initialDate));
  const [selectedView, setSelectedView] = useState(initialView);
  const [calendarDays,setCalendarDays] = useState([]);

  const [weekRange, setWeekRange] = useState("");
  const [monthDates, setMonthDates] = useState([]);

  const formatDateRange = () => {
    if(selectedView === "day"){
      const day = selectedDate
      return `${day.format("D-M-YYYY")}`
    }else if(selectedView === "week"){
      const startOfWeek = selectedDate.startOf("week");
      const endOfWeek = selectedDate.endOf("week");
      return `${startOfWeek.format("D-M-YYYY")} ~ ${endOfWeek.format("D-M-YYYY")}`;
    }else{
      const startOfMonth = selectedDate.startOf("month");
      const endOfMonth = selectedDate.endOf("month");
      return `${startOfMonth.format("D-M-YYYY")} ~ ${endOfMonth.format("D-M-YYYY")}`;
    }
  };

  //generate calendar for week/month view
  useEffect(() => {
    const generateCalendarDays = () => {
      const daysArray = []
      let startDay,endDay;
      if(selectedView === "day"){
        startDay = selectedDate;
        endDay = selectedDate;
      }else if(selectedView === "week"){
        startDay = selectedDate.startOf("week")
        endDay = selectedDate.endOf("week")
      }else{
        startDay = selectedDate.startOf("month")
        endDay = selectedDate.endOf("month")
      }

      let currentDay = startDay;
      const inclusiveEnd = endDay.add(1, "day");

      // console.log("Generating calendar for:", startDay.format("YYYY-MM-DD"), "~", endDay.format("YYYY-MM-DD"));

      while(currentDay.isBefore(inclusiveEnd)){
        daysArray.push({
          date: currentDay,
          dayOfMonth: currentDay.date(),
          isCurrentMonth: selectedView === "month" ? currentDay.month() === selectedDate.month() : true,
          weekday: currentDay.format("dd"),
          isToday: currentDay.isSame(dayjs(), "day"),
        });
        currentDay = currentDay.add(1, "day");
      }
      setCalendarDays(daysArray)
    }
    generateCalendarDays()
  },[selectedDate,selectedView])

  // Notify parent when date range changes
  useEffect(() => {
    let start, end;
  
    if (selectedView === "week") {
      start = selectedDate.startOf("week");
      end = selectedDate.endOf("week");
    } else if(selectedView === "day"){
      start = selectedDate;
      end = selectedDate;
    }else {
      start = selectedDate.startOf("month");
      end = selectedDate.endOf("month");
    }
  
    // console.log("Updated Date Range:", start.format("YYYY-MM-DD"), "~", end.format("YYYY-MM-DD"));
  
    if (onDateRangeChange) {
      onDateRangeChange(start, end, selectedView);
    }
  }, [selectedDate, selectedView, onDateRangeChange]);

  // // Calculate week range using dayjs
  // useEffect(() => {
  //   const calculateWeekRange = () => {
  //     const currentDate = dayjs(selectedDate);
  //     const weekStart = currentDate.startOf("week");
  //     const weekEnd = weekStart.add(6, "days");
      
  //     setWeekRange(`${formatDate(weekStart)} ~ ${formatDate(weekEnd)}`);
  //   };

  //   if (selectedView === "week") {
  //     calculateWeekRange();
  //   } else {
  //     setWeekRange("");
  //   }
  // }, [selectedDate, selectedView]);

  // Calculate month dates using dayjs
  // useEffect(() => {
  //   const calculateMonthDates = () => {
  //     const currentDate = dayjs(selectedDate);
  //     const startOfMonth = currentDate.startOf("month");
  //     const endOfMonth = currentDate.endOf("month");

  //     const dates = [];
  //     let current = startOfMonth;

  //     // Include days from the previous month to fill the first week
  //     while (current.day() !== 0) {
  //       current = current.subtract(1, "day");
  //     }

  //     // Generate all dates for the calendar grid
  //     while (current.isBefore(endOfMonth) || current.day() !== 0) {
  //       dates.push(current.format("YYYY-MM-DD"));
  //       current = current.add(1, "day");
  //     }

  //     setMonthDates(dates);
  //   };

  //   if (selectedView === "month") {
  //     calculateMonthDates();
  //   }
  // }, [selectedDate, selectedView]);

  // Adjust date based on the navigation (prev/next/today)
  const adjustDate = (direction) => {
    let currentDate = dayjs(selectedDate);

    if (direction === "prev") {
      if (selectedView === "day") {
        currentDate = currentDate.subtract(1, "day");
      } else if (selectedView === "week") {
        currentDate = currentDate.subtract(1, "week");
      } else if (selectedView === "month") {
        currentDate = currentDate.subtract(1, "month");
      }
    } else if (direction === "next") {
      if (selectedView === "day") {
        currentDate = currentDate.add(1, "day");
      } else if (selectedView === "week") {
        currentDate = currentDate.add(1, "week");
      } else if (selectedView === "month") {
        currentDate = currentDate.add(1, "month");
      }
    } else if (direction === "today") {
      currentDate = dayjs(); // Set to today's date
    }

    setSelectedDate(currentDate);
  };
  // Handle view change
  const changeView = (view) => {
    setSelectedView(view);
  };
  

  return (
    <div className="datePicker">
      {/* Date Navigation */}
      <div className="dateNavigateDiv">
        <div className="dateNavigation">
          <button className="nav-btn" onClick={() => adjustDate("prev")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 0.48291L10 1.86222L4 6.00015L10 10.1381L8 11.5174L0 6.00015L8 0.48291Z" fill="#F27D14"/>
            </svg>
          </button>

          <div className="selectedDate">
            {formatDateRange()}
          </div>

          <button className="nav-btn" onClick={() => adjustDate("next")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.65934 11.05L0.583257 9.72522L6.34597 5.42987L0.117708 1.45559L2.03861 0.0238068L10.343 5.32285L2.65934 11.05Z" fill="#F27D14"/>
            </svg>
          </button>
        </div>

        <button className="todayBtn" onClick={() => adjustDate("today")}>
          Today
        </button>
      </div>

      {/* Calendar Tabs */}
      {/* <div className="calendarTabs">
        {["day", "week", "month"].map((view) => (
          <button
            key={view}
            className={selectedView === view ? "active" : ""}
            onClick={() => setSelectedView(view)}
          >
            {view}
          </button>
        ))}
      </div> */}
      <div className="calendarTabs">
          <button className={`view-btn ${selectedView === "day" ? "active" : ""}`} onClick={() => changeView("day")}>
                Day
          </button>
          <button className={`view-btn ${selectedView === "week" ? "active" : ""}`} onClick={() => changeView("week")}>
            Week
          </button>
          <button className={`view-btn ${selectedView === "month" ? "active" : ""}`} onClick={() => changeView("month")}>
            Month
          </button>
        </div>
    </div>
  );
};

export default HomeDate;
