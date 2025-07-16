import { BryntumCalendarProps } from '@bryntum/calendar-react';
import { CustomEventModel } from './lib/CustomEventModel';
import { CustomResourceModel } from './lib/CustomResourceModel';

const calendarProps: BryntumCalendarProps = {
    date    : new Date(2025, 9, 20),
    project : {
        eventStore : {
            modelClass : CustomEventModel
        },
        resourceStore : {
            modelClass : CustomResourceModel
        }
    }

};

export { calendarProps };
