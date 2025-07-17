'use client';

import { Event, Page, Resource } from '@/.storyblok/types/storyblok-components';
import { Model, ProjectConsumer, ProjectModelMixin, Store, Toast } from '@bryntum/calendar';
import { BryntumCalendar } from '@bryntum/calendar-react';
import { useContext, useEffect, useRef } from 'react';
import { calendarProps } from '../calendarConfig';
import { Story, StoryDataContext } from '../contexts/StoryData.context';
import { convertDateToSbFormat } from '../helpers';
import { CustomEventModelType } from '../lib/CustomEventModel';
import { CustomResourceModelType } from '../lib/CustomResourceModel';
import { debounce } from '../utils';

type SyncData = ((event: {
    source: typeof ProjectConsumer;
    project: typeof ProjectModelMixin;
    store: Store;
    action: 'remove' | 'removeAll' | 'add' | 'clearchanges' | 'filter' | 'update' | 'dataset' | 'replace';
    record: Model | CustomEventModelType | CustomResourceModelType;
    records: Model[] | CustomEventModelType[] | CustomResourceModelType[];
    changes: object;
}) => void) | string

type UpdatedStory = {
    story: Story;
}

export default function Calendar() {
    const { storyData, setStoryData } = useContext(StoryDataContext);
    const currCalendarComponentIndex = storyData?.content?.body?.findIndex(
        (item) => item.hasOwnProperty('events')
    );
    const calendarRef = useRef<BryntumCalendar>(null);

    function updateStory(updatedStory: UpdatedStory) {
        delete updatedStory.story.content._editable;

        const currCalendarComponentIndex = storyData?.content?.body?.findIndex(
            (item) => item.hasOwnProperty('events')
        );

        if (!currCalendarComponentIndex) return;
        updatedStory.story.content.body?.map((item) => {
            delete item._editable;
        });
        if (updatedStory.story.content.body?.[currCalendarComponentIndex]?.events) {
            updatedStory.story.content.body[currCalendarComponentIndex].events =
            (updatedStory.story.content.body[currCalendarComponentIndex].events as CustomEventModelType[]).map((event: CustomEventModelType) => {
                delete event._editable;
                return event;
            });
        }
        if (updatedStory?.story?.content?.body?.[currCalendarComponentIndex]?.resources) {
            updatedStory.story.content.body[currCalendarComponentIndex].resources =
            (updatedStory.story.content.body[currCalendarComponentIndex].resources as CustomResourceModelType[]).map((resource: CustomResourceModelType) => {
                delete resource._editable;
                return resource;
            });
        }
        fetch('/api/update', {
            method  : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(updatedStory)
        })
            .then((response) => response.json())
            .then((data) => {

                // Handle conflict response
                if (data.conflict) {
                    Toast.show({
                        html    : 'Content conflict detected. Please click the <b>Save</b> button in the Storyblok Visual Editor to resolve.',
                        side    : 'bottom',
                        timeout : 10000
                    });
                    return; // Exit early to prevent error
                }

                const newCalendarComponentIndex = data.story.content?.body.findIndex(
                    (item: Page) => item.hasOwnProperty('events')
                );

                if (JSON.stringify(
                    updatedStory?.story?.content?.body?.[currCalendarComponentIndex]?.events
                ) !==
              JSON.stringify(data.story.content.body[newCalendarComponentIndex].events) ||
              JSON.stringify(
                  updatedStory?.story?.content?.body?.[currCalendarComponentIndex]?.resources
              ) !==
              JSON.stringify(data.story.content.body[newCalendarComponentIndex].resources)
                ) {
                    if (data.story.content.body[newCalendarComponentIndex].events) {
                        data.story.content.body[newCalendarComponentIndex].events =
                  data.story.content.body[newCalendarComponentIndex].events.map(
                      (event: CustomEventModelType) => {
                          delete event._editable;
                          return event;
                      }
                  );
                    }
                    if (data.story.content.body[newCalendarComponentIndex].resources) {
                        data.story.content.body[newCalendarComponentIndex].resources =
                  data.story.content.body[newCalendarComponentIndex].resources.map(
                      (resource: CustomResourceModelType) => {
                          delete resource._editable;
                          return resource;
                      }
                  );
                    }
                    setStoryData(JSON.parse(JSON.stringify(data.story)));
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const debouncedFetch = debounce((updatedStory: UpdatedStory) => {
        updateStory(updatedStory);
    }, 1000);

    const syncData: SyncData = ({ store, action, record, records }) => {
        const storeId = store.id;

        if (storeId === 'events') {
            const eventRecord = record as CustomEventModelType;

            if (action === 'remove') {
                const storyDataState: Story = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content?.body?.map((item) => {
                    if (item.component === 'calendar') {
                        records.forEach((evt) => {
                            item.events = item.events?.filter(
                                (event) => event.id !== evt.id
                            );
                        });
                    }
                    return item;
                });
                const updatedStory = {
                    story : {
                        ...storyDataState,
                        content : {
                            ...storyData.content,
                            body : updatedContent
                        }
                    }
                };
                debouncedFetch(updatedStory);
            }

            if (action === 'update') {
                const storyDataState: Story = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content.body?.map((item) => {
                    if (item.component === 'calendar') {
                        const existingEventIndex = item.events?.findIndex(
                            (event) => event.id === eventRecord.id
                        );

                        if (!existingEventIndex) return item;

                        const eventData = {
                            id             : existingEventIndex >= 0 ? eventRecord.id : crypto.randomUUID(),
                            _uid           : existingEventIndex >= 0 ? eventRecord.get('_uid') : crypto.randomUUID(),
                            name           : eventRecord.name,
                            startDate      : convertDateToSbFormat(`${eventRecord.startDate}`),
                            endDate        : convertDateToSbFormat(`${eventRecord.endDate}`),
                            component      : 'event',
                            resourceId     : eventRecord.resourceId,
                            readOnly       : eventRecord.readOnly || false,
                            draggable      : eventRecord.draggable !== false,
                            resizable      : eventRecord.resizable !== false,
                            allDay         : eventRecord.allDay || false,
                            exceptionDates : eventRecord.exceptionDates ? JSON.stringify(eventRecord.exceptionDates) : undefined,
                            recurrenceRule : eventRecord.recurrenceRule,
                            cls            : eventRecord.cls,
                            eventColor     : eventRecord.eventColor,
                            eventStyle     : eventRecord.eventStyle,
                            iconCls        : eventRecord.iconCls,
                            style          : eventRecord.style
                        };

                        if (item.events && existingEventIndex >= 0) {
                            // Update existing event
                            item.events[existingEventIndex] = eventData as Event;
                        }
                        else {
                            // Create new event (first update after add)
                            item.events?.push(eventData as Event);
                        }
                    }
                    return item;
                });

                const updatedStory = {
                    story : {
                        ...storyDataState,
                        content : {
                            ...storyData.content,
                            body : updatedContent
                        }
                    }
                };
                debouncedFetch(updatedStory);
            }
        }

        if (storeId === 'resources') {
            const resourceRecord = record as CustomResourceModelType;

            if (action === 'remove') {
                const storyDataState: Story = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content?.body?.map((item) => {
                    if (item.component === 'calendar') {
                        records.forEach((res) => {
                            item.resources = item.resources?.filter(
                                (resource) => resource.id !== res.id
                            );
                        });
                    }
                    return item;
                });
                const updatedStory = {
                    story : {
                        ...storyDataState,
                        content : {
                            ...storyData.content,
                            body : updatedContent
                        }
                    }
                };
                debouncedFetch(updatedStory);
            }

            if (action === 'update') {
                const storyDataState: Story = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content?.body?.map((item) => {
                    if (item.component === 'calendar') {
                        const existingResourceIndex = item.resources?.findIndex(
                            (resource) => resource.id === resourceRecord.id
                        );

                        const resourceData = {
                            id         : resourceRecord.id,
                            _uid       : resourceRecord.get('_uid') || crypto.randomUUID(),
                            name       : resourceRecord.name,
                            eventColor : resourceRecord.eventColor,
                            readOnly   : resourceRecord.readOnly || false,
                            component  : 'resource'
                        };

                        if (item.resources && existingResourceIndex && existingResourceIndex >= 0) {
                            // Update existing resource
                            item.resources[existingResourceIndex] = resourceData as Resource;
                        }
                        else {
                            // Create new resource (first update after add)
                            item.resources?.push(resourceData as Resource);
                        }
                    }
                    return item;
                });

                const updatedStory = {
                    story : {
                        ...storyDataState,
                        content : {
                            ...storyData.content,
                            body : updatedContent
                        }
                    }
                };
                debouncedFetch(updatedStory);
            }
        }
    };

    useEffect(() => {
    // Bryntum Calendar instance
        const calendar = calendarRef?.current?.instance;
    }, []);

    return (
        <BryntumCalendar
            ref={calendarRef}
            events={currCalendarComponentIndex !== undefined ? (storyData?.content?.body?.[currCalendarComponentIndex]?.events as CustomEventModelType[]) || [] : []}
            resources={currCalendarComponentIndex !== undefined ? (storyData?.content?.body?.[currCalendarComponentIndex]?.resources as CustomResourceModelType[]) || [] : []}
            onDataChange={syncData}
            {...calendarProps}
        />
    );
}