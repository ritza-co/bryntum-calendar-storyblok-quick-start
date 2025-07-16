'use client';

import { Page } from '@/.storyblok/types/storyblok-components';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export type Story =  {
    content: Page;
    [index: string]: unknown;
  };

export const StoryDataContext = createContext({
    storyData    : {} as Story,
    setStoryData : (() => {}) as Dispatch<SetStateAction<Story>>
});

export default function StoryDataProvider({
    children
}: {
  children: React.ReactNode;
}) {
    const [storyData, setStoryData] = useState<Story>({} as Story);
    return (
        <StoryDataContext.Provider
            value={{
                storyData,
                setStoryData
            }}
        >
            {children}
        </StoryDataContext.Provider>
    );
}