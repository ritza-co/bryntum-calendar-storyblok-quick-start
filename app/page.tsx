'use client';

import { Page } from '@/.storyblok/types/storyblok-components';
import { StoryblokComponent, useStoryblok } from '@storyblok/react';
import { useContext, useEffect } from 'react';
import { Story, StoryDataContext } from './contexts/StoryData.context';

export default function Home() {
    const story = useStoryblok('/home', { version : 'draft' });
    const { setStoryData } = useContext(StoryDataContext);
    useEffect(() => {
        if (!story?.content) return;

        const transformedStory: Story = {
            ...story,
            content : {
                ...story.content,
                component : 'page',
                _uid      : story.content._uid || '',
                body      : story.content.body?.map((block: Page) => {
                    if (block.events) {
                        return {
                            ...block,
                            events : (block.events as Event[]).map((event: Event) => {
                                // Filter out empty string fields
                                return Object.fromEntries(
                                    Object.entries(event).filter(([, value]) => value !== '')
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