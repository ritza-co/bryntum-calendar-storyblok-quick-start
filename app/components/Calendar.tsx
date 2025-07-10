"use client";

import { BryntumCalendar } from "@bryntum/calendar-react";
import { useRef } from "react";

export default function Calendar({ ...props }) {
  const calendarRef = useRef<BryntumCalendar>(null);

  return <BryntumCalendar {...props} ref={calendarRef} />;
}
