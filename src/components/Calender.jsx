import React, { useState, useEffect } from "react";
import "../assets/styles/calender.scss"

const Calendar = () => {
  const [view, setView] = useState("week"); // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (view === "week") {
      setDates(generateWeekDates(currentDate));
    } else if (view === "month") {
      setDates(generateMonthDates(currentDate));
    }
  }, [view, currentDate]);

  // Generate dates for the week view
  const generateWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Generate dates for the month view
  const generateMonthDates = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthDates = [];
    let day = new Date(start);

    while (day <= end) {
      monthDates.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return monthDates;
  };

  // Navigation handlers
  const goToNext = () => {
    if (view === "week") {
      setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 7)));
    } else {
      setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
    }
  };

  const goToPrev = () => {
    if (view === "week") {
      setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 7)));
    } else {
      setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button onClick={goToPrev}>{"<"}</button>
        <div>
          {view === "week"
            ? `Week of ${dates[0]?.toLocaleDateString()}`
            : currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
        </div>
        <button onClick={goToNext}>{">"}</button>
      </div>

      {/* View Toggle */}
      <div className="calendar-controls">
        <button onClick={goToToday}>Go to Today</button>
        <button onClick={() => setView(view === "week" ? "month" : "week")}>
          Switch to {view === "week" ? "Month" : "Week"} View
        </button>
      </div>

      {/* Calendar View */}
      <div className={`calendar-view ${view}`}>
        {view === "week" && (
          <div className="week-view">
            {dates.map((date) => (
              <div key={date} className="date-cell">
                <div className="day">
                  {date.toLocaleString("default", { weekday: "short" })}
                </div>
                <div className="date">{date.getDate()}</div>
              </div>
            ))}
          </div>
        )}

        {view === "month" && (
          <div className="month-scrollable-row">
            {dates.map((date) => (
              <div key={date} className="date-cell">
                <div className="day">
                  {date.toLocaleString("default", { weekday: "short" })}
                </div>
                <div className="date">{date.getDate()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
