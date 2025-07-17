'use client';

import { BryntumCalendar } from '@bryntum/calendar-react';
import { useEffect, useRef } from 'react';
import { calendarProps } from '../calendarConfig';

export default function Calendar() {
    const calendarRef = useRef<BryntumCalendar>(null);

    useEffect(() => {
        // Bryntum Calendar instance
        const calendar = calendarRef?.current?.instance;
    }, []);

    return <BryntumCalendar ref={calendarRef} {...calendarProps} />;
}
