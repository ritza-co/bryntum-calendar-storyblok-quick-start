import { SbBlokData, storyblokEditable } from '@storyblok/react';
import { Calendar } from '../../.storyblok/types/285757208479996/storyblok-components';
import { CalendarWrapper } from './CalendarWrapper';

const CalendarSb = ({ blok }: { blok: Calendar & SbBlokData }) => {
    return (
        <div {...storyblokEditable(blok)} style={{ flex : 1 }}>
            <CalendarWrapper />
        </div>
    );
};

export default CalendarSb;