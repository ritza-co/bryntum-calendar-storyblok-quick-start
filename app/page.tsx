'use client';
import '@bryntum/calendar/calendar.stockholm.css';
import { StoryblokComponent, useStoryblok } from '@storyblok/react';
import { useContext, useEffect } from 'react';
import { StoryDataContext } from './contexts/StoryData.context';

export default function Home() {
    const story = useStoryblok('/home', { version : 'draft' });
    const { setStoryData } = useContext(StoryDataContext);
    useEffect(() => {
        if (!story?.content) return;

        const transformedStory = {
            ...story,
            content : {
                ...story.content,
                body : story.content.body?.map(block => {
                    if (block.events) {
                        return {
                            ...block,
                            events : block.events.map(event => {
                                // Filter out empty string fields
                                return Object.fromEntries(
                                    Object.entries(event).filter(([key, value]) => value !== '')
                                );
                            })
                        };
                    }
                    return block;
                })
            }
        };

        setStoryData(transformedStory);
    }, [story, setStoryData]);

    if (!story || !story.content) {
        return <div>Loading...</div>;
    }

    return <StoryblokComponent blok={story.content} />;
}