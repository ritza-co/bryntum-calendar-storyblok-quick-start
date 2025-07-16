'use client';

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('./Calendar'), {
    ssr     : false,
    loading : () => {
        return (
            <div
                style={{
                    display        : 'flex',
                    alignItems     : 'center',
                    justifyContent : 'center',
                    height         : '100vh'
                }}
            >
                <p>Loading...</p>
            </div>
        );
    }
});

const CalendarWrapper = () => {
    return <Calendar />;
};

export { CalendarWrapper };
