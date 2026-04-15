import { useState, useEffect } from "react";
import "../ClassSchedule/ClassSchedule.css";
import "../../css/ManageSubjects.css";
//function to parse schedule string into array of {col, startRow, endRow} objects
const parseSchedule = (scheduleString) => {
  if (!scheduleString || scheduleString === "TBA") return [];

  const days = { M: 2, T: 3, W: 4, Th: 5, F: 6 };
  const blocks = [];

  try {
    const [daysString, timeRange, period] = scheduleString.split(" ");
    const [start, end] = timeRange.split("-");

    let activeCols = [];
    let d = daysString;

    //extract active columns based on days string
    if (d.includes("M")) activeCols.push(days.M);
    if (d.includes("Th")) {
      activeCols.push(days.Th);
      d = d.replace("Th", "");
    }
    if (d.includes("W")) activeCols.push(days.W);
    if (d.includes("T")) activeCols.push(days.T);
    if (d.includes("F")) activeCols.push(days.F);

    // Function to convert time string to row number
    const timeRow = (timeStr, isPM) => {
      let [hour, mins] = timeStr.split(":").map(Number);
      if (hour === 12 && !isPM) hour = 0;
      if (hour < 7 && isPM) hour += 12;

      const hourOffset = (hour - 7) * 2;
      const minsOffset = mins >= 30 ? 1 : 0;
      return hourOffset + minsOffset + 2;
    };

    const isPM = period === "PM";
    const startRow = timeRow(start, isPM);
    const endRow = timeRow(end, isPM);

    activeCols.forEach((col) => {
      blocks.push({ col, startRow, endRow });
    });
  } catch (error) {
    console.error("Error parsing schedule string:", error);
  }
  return blocks;
  //   end of parsing function
};

//starrt of class schedule component
export default function ClassSchedule() {
  const [mySubjects, setMySubjects] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("eduEnroll_mySubjects");
    if (saved) {
      setMySubjects(JSON.parse(saved));
    }
  }, []);

  const times = [
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const colors = ["#fa6d06", "#4caf50", "#2196f3", "#9c27b0", "#e91e63"];

  return (
    <div
      className="timetable-container"
      style={{ width: "100%", overflowX: "auto", paddingBottom: "15px" }}
    >
      <div className="timetable-grid">
        <div className="time-header">Time</div>

        {days.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {times.map((time, index) => (
          <div
            key={time}
            className="timeLabel"
            style={{ gridRow: `${index * 2 + 2} / span 2` }}
          >
            <span>{time}</span>
          </div>
        ))}

        {times.map((_, index) => (
          <div
            key={`line-${index}`}
            className="grid-line"
            style={{ gridRow: `${index * 2 + 2}` }}
          ></div>
        ))}

        {mySubjects.map((subject, index) => {
          const blocks = parseSchedule(subject.schedule);
          return blocks.map((block, blockIndex) => (
            <div
              key={`${subject.id}-${blockIndex}`}
              className="class-block"
              style={{
                gridColumn: block.col,
                gridRow: `${block.startRow} / ${block.endRow}`,
                backgroundColor: colors[index % colors.length],
              }}
            >
              <strong>{subject.code}</strong>
              <span className="block-room">{subject.section}</span>
              <span className="block-time">
                {subject.schedule ? subject.schedule.split(" ")[1] : "TBA"}
              </span>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
// end of class schedule component
