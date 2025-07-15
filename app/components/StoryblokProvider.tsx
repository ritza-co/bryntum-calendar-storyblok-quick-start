'use client';
import { apiPlugin, storyblokInit } from '@storyblok/react';
import { ReactNode } from 'react';
import CalendarSb from './CalendarSb';
import Header from './Header';
import Page from './Page';

const components = {
    page     : Page,
    header   : Header,
    calendar : CalendarSb
};

storyblokInit({
    accessToken : process.env.NEXT_PUBLIC_STORYBLOK_API_TOKEN,
    use         : [apiPlugin],
    components
});

export default function StoryblokProvider({
    children
}: {
  children: ReactNode;
}) {
    return children;
}