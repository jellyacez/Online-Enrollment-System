import {useState, useEffect} from "react";

const parseSchedule = (scheduleString) => {
    if(!scheduleString || scheduleString === "TBA") return [];

    const days = {M: 2, T: 3, W: 4, Th: 5, F: 6, S: 7};
    const blocks = [];

    try {
        const [daysString, timeRange, period] = scheduleString.split(" ");
        const [start, end] = timeRange.split("-");

        let activeCols = [];
        let d = daysString;

        if(d.includes("M")) activeCols.push(days.M);
        if(d.includes("Th")){
            activeCols.push(days.Th);
            d = d.replace("Th", "");
        };
        if(d.includes("W")) activeCols.push(days.W);
        if(d.includes("T")) activeCols.push(days.Th);
        if(d.includes("F")) activeCols.push(days.F);
        if(d.includes("S")) activeCols.push(days.S);
    }
}