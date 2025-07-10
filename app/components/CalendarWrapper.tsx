'use client';

import dynamic from "next/dynamic";
import { calendarProps } from "../calendarConfig";

const Calendar = dynamic(() => import("./Calendar"), {
  ssr: false,
  loading: () => {
    return (
      <div
        style={{
          display        : "flex",
          alignItems     : "center",
          justifyContent : "center",
          height         : "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  },
});

const CalendarWrapper = () => {
    return <Calendar {...calendarProps} />
};
export { CalendarWrapper };
