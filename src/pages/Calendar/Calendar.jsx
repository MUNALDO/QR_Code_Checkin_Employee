import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import axios from "axios";
import "date-fns-tz";
import { getMonth } from 'date-fns';
import { format } from "date-fns-tz";
import { AuthContext } from "../../context/AuthContext";

const ScheduleTable = (props) => {
  const {
    user: { id: userID },
  } = useContext(AuthContext);
  const { id } = props;
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [addShiftFormState, setShiftFormState] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMonth) {
        try {
          const monthNumber = getMonth(selectedMonth) + 1;  // Get the month number
          const response = await axios.get(
            `https://qr-code-checkin.vercel.app/api/employee/get-schedules?employeeID=${userID}&month=${monthNumber}`,
            { withCredentials: true }
          );
          setEmployeeData(response.data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      }
    };

    fetchData();
  }, [userID, selectedMonth]);

  // console.log(employeeData);

  const renderTileContent = ({ date }) => {
    if (!employeeData || !employeeData.message) return null;

    const shiftCodesForDate = employeeData.message
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.toDateString() === date.toDateString();
      })
      .map((schedule) => schedule.shift_design.map((shift) => shift.shift_code))
      .flat();

    return (
      <div
        className={`calendar-tile ${
          shiftCodesForDate.length > 0 ? "scheduled" : ""
        }`}
      >
        {/* You can customize the content of the tile here */}
        {shiftCodesForDate.length > 0 ? (
          shiftCodesForDate.map((shiftCode, index) => (
            <div key={index}>{shiftCode}</div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const [formData, setFormData] = useState({
    data: {
      shift_code: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      data: {
        ...prevData.data,
        [name]: value,
      },
    }));
  };

  const userString = localStorage.getItem("user");
  const userObject = userString ? JSON.parse(userString) : null;
  // console.log(userObject);

  const handleClickDay = (value, event) => {
    setShiftFormState(true);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
      timeZone,
    });
    console.log("Selected date:", localDate);

    setSelectedDate(localDate);
    console.log(value);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-4 font-Changa text-textColor">
      <h2 className="text-2xl font-bold">Schedule Calendar</h2>
      {selectedYear && (
        <Calendar
          onChange={handleMonthChange}
          onClickDay={handleClickDay}
          value={selectedMonth}
          view="month"
          showNeighboringMonth={false}
          tileContent={renderTileContent}
        />
      )}
    </div>
  );
};

export default ScheduleTable;
