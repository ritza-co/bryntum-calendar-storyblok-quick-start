'use client';

import { Page } from '@/.storyblok/types/storyblok-components';
import { getStoryblokApi } from '@storyblok/react';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export type Story =  {
    content: Page;
    [index: string]: unknown;
  };

export const StoryDataContext = createContext({
    storyData       : {} as Story,
    setStoryData    : (() => {}) as Dispatch<SetStateAction<Story>>,
    invalidateCache : (() => {}) as () => void,
    refreshStory    : (() => {}) as () => void,
    cacheKey        : 0 as number
});

export default function StoryDataProvider({
    children
}: {
  children: React.ReactNode;
}) {
    const [storyData, setStoryData] = useState<Story>({} as Story);
    const [cacheKey, setCacheKey] = useState(0);

    const invalidateCache = () => {
        const storyblokApi = getStoryblokApi();
        storyblokApi.flushCache();
    };

    const refreshStory = () => {
        invalidateCache();
        setCacheKey(Date.now());
    };

    return (
        <StoryDataContext.Provider
            value={{
                storyData,
                setStoryData,
                invalidateCache,
                refreshStory,
                cacheKey
            }}
        >
            {children}
        </StoryDataContext.Provider>
    );
}