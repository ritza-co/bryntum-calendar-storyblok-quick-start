import { BryntumCalendarProps } from '@bryntum/calendar-react';

const calendarProps: BryntumCalendarProps = {
    date : new Date(2022, 2, 15),

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
