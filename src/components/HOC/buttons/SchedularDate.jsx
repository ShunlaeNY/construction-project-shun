import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import "../../../assets/styles/buttons/schedularDate.scss";


// Extend dayjs with plugins
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const SchedularDate = ({ onDateRangeChange, initialView = "month", initialDate = dayjs() }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(initialDate));
  const [selectedView, setSelectedView] = useState(initialView);
  const [calendarDays, setCalendarDays] = useState([]);

  // Format date range for display
  const formatDateRange = () => {
    if (selectedView === "week") {
      const startOfWeek = selectedDate.startOf("week");
      const endOfWeek = selectedDate.endOf("week");
      return `${startOfWeek.format("D-M-YYYY")} ~ ${endOfWeek.format("D-M-YYYY")}`;
    } else {
      const startOfMonth = selectedDate.startOf("month");
      const endOfMonth = selectedDate.endOf("month");
      return `${startOfMonth.format("D-M-YYYY")} ~ ${endOfMonth.format("D-M-YYYY")}`;
    }
  };

  // Generate calendar days for month/week view
  useEffect(() => {
    const generateCalendarDays = () => {
      const daysArray = [];
      let startDay = selectedView === "week" ? selectedDate.startOf("week") : selectedDate.startOf("month");
      let endDay = selectedView === "week" ? selectedDate.endOf("week") : selectedDate.endOf("month");

      let currentDay = startDay;

      console.log("Generating calendar for:", startDay.format("YYYY-MM-DD"), "~", endDay.format("YYYY-MM-DD"));

      while (currentDay.isBefore(endDay.add(1, "day"))) {
        daysArray.push({
          date: currentDay,
          dayOfMonth: currentDay.date(),
          isCurrentMonth: selectedView === "month" ? currentDay.month() === selectedDate.month() : true,
          weekday: currentDay.format("dd"),
          isToday: currentDay.isSame(dayjs(), "day"),
        });
        currentDay = currentDay.add(1, "day");
      }

      setCalendarDays(daysArray);
    };

    generateCalendarDays();
  }, [selectedDate, selectedView]);

  // Notify parent when date range changes
  useEffect(() => {
    let start, end;

    if (selectedView === "week") {
      start = selectedDate.startOf("week");
      end = selectedDate.endOf("week");
    } else {
      start = selectedDate.startOf("month");
      end = selectedDate.endOf("month");
    }

    console.log("Updated Date Range:", start.format("YYYY-MM-DD"), "~", end.format("YYYY-MM-DD"));

    if (onDateRangeChange) {
      onDateRangeChange(start, end, selectedView);
    }
  }, [selectedDate, selectedView, onDateRangeChange]);

  // Adjust date based on navigation
  const adjustDate = (direction) => {
    let newDate;
    if (direction === "prev") {
      newDate = selectedView === "week" ? selectedDate.subtract(1, "week") : selectedDate.subtract(1, "month");
    } else if (direction === "next") {
      newDate = selectedView === "week" ? selectedDate.add(1, "week") : selectedDate.add(1, "month");
    } else if (direction === "today") {
      newDate = dayjs();
    }

    console.log("New Selected Date:", newDate.format("YYYY-MM-DD"));
    setSelectedDate(newDate);
  };

  // Handle view change
  const changeView = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="ScheduleDateflexCol">
      <div className="schedularDatePicker">
        {/* Date Navigation */}
        <div className="dateNavigateDiv">
          <div className="dateNavigation">
            <button className="nav-btn" onClick={() => adjustDate("prev")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 0.48291L10 1.86222L4 6.00015L10 10.1381L8 11.5174L0 6.00015L8 0.48291Z" fill="#F27D14"/>
              </svg>
            </button>
            <div className="selectedDate">{formatDateRange()}</div>
            <button className="nav-btn" onClick={() => adjustDate("next")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.65934 11.05L0.583257 9.72522L6.34597 5.42987L0.117708 1.45559L2.03861 0.0238068L10.343 5.32285L2.65934 11.05Z" fill="#F27D14"/>
              </svg>
            </button>
          </div>
          <button className="todayBtn" onClick={() => adjustDate("today")}>Today</button>
        </div>

        {/* Calendar Tabs */}
        <div className="calendarTabs">
          <button className={`view-btn ${selectedView === "week" ? "active" : ""}`} onClick={() => changeView("week")}>
            Week
          </button>
          <button className={`view-btn ${selectedView === "month" ? "active" : ""}`} onClick={() => changeView("month")}>
            Month
          </button>
        </div>
      </div>

      {/* Calendar Timeline */}
      <div className="calendarTimeline">
        {/* Month View */}
        {selectedView === "month" && (
          <div className="calendar-days-container">
            <div className="labels">
              {/* <Search /> */}
            </div>
            
            <div className="calendar-days">
              <div className="days-header">
                {calendarDays.map((day, index) => (
                  <div key={index} className={`day-header ${day.isToday ? "today" : ""}`}>
                    {day.weekday}
                  </div>
                ))}
              </div>
              <div className="days-grid">
                {calendarDays.map((day, index) => (
                  <div key={index} className={`day-cell ${day.isToday ? "today" : ""}`}>
                    {day.dayOfMonth}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Week View */}
        {selectedView === "week" && (
          <div className="calendar-days-container">
            <div className="labels"></div>
            <div className="calendar-days">
              <div className="days-header-week">
                {calendarDays.map((day, index) => (
                  <div key={index} className={`day-header-week ${day.isToday ? "today" : ""}`}>
                    {day.weekday}
                  </div>
                ))}
              </div>
              <div className="days-grid-week">
                {calendarDays.map((day, index) => (
                  <div key={index} className={`day-cell-week ${day.isToday ? "today" : ""}`}>
                    {day.dayOfMonth}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedularDate;

