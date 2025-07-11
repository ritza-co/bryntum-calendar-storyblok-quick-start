import { BryntumCalendarProps } from '@bryntum/calendar-react';

const calendarProps: BryntumCalendarProps = {
    date        : new Date(2025, 9, 20),
    crudManager : {
        transport : {
            load : {
                url : 'data.json'
            }
        },
        autoLoad : true
    }
};

export { calendarProps };
