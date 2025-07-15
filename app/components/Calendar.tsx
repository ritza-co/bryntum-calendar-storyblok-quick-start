'use client';

import { EventModel, ResourceModel } from '@bryntum/calendar';
import { BryntumCalendar } from '@bryntum/calendar-react';
import { ISbStoryData } from '@storyblok/react';
import { useContext, useEffect, useRef } from 'react';
import { ISbComponentType } from 'storyblok-js-client';
import { StoryDataContext } from '../contexts/StoryData.context';
import { convertDateToSbFormat } from '../helpers';

type SyncData = {
    store: {
      id: 'events' | 'resources';
    };
    action: 'dataset' | 'add' | 'remove' | 'update';
    record: EventModel | ResourceModel;
    records: (EventModel | ResourceModel)[];
    changes: { [key: string]: any };
  };

  type Story = ISbStoryData<
    ISbComponentType<string> & {
      [index: string]: any;
    }
  >;

export default function Calendar({ ...props }) {
    const { storyData, setStoryData } = useContext(StoryDataContext);

    const currCalendarComponentIndex = storyData?.content?.body.findIndex(
        (item: any) => item.hasOwnProperty('events')
    );
    const calendarRef = useRef<BryntumCalendar>(null);

    function updateStory(updatedStory: any) {
        const currCalendarComponentIndex = storyData?.content?.body.findIndex(
            (item: any) => item.hasOwnProperty('events')
        );

        // Remove _editable property from events and resources
        if (updatedStory.story.content.body[currCalendarComponentIndex].events) {
            updatedStory.story.content.body[currCalendarComponentIndex].events =
            updatedStory.story.content.body[currCalendarComponentIndex].events.map((event: EventModel) => {
                const { _editable, ...rest } = event;
                return rest;
            });
        }
        if (updatedStory.story.content.body[currCalendarComponentIndex].resources) {
            updatedStory.story.content.body[currCalendarComponentIndex].resources =
            updatedStory.story.content.body[currCalendarComponentIndex].resources.map((resource: ResourceModel) => {
                const { _editable, ...rest } = resource;
                return rest;
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
                const newCalendarComponentIndex = data.story.content?.body.findIndex(
                    (item: any) => item.hasOwnProperty('events')
                );

                if (
                    JSON.stringify(
                        updatedStory.story.content.body[currCalendarComponentIndex].events
                    ) !==
              JSON.stringify(data.story.content.body[newCalendarComponentIndex].events) ||
              JSON.stringify(
                  updatedStory.story.content.body[currCalendarComponentIndex].resources
              ) !==
              JSON.stringify(data.story.content.body[newCalendarComponentIndex].resources)
                ) {
                    if (data.story.content.body[newCalendarComponentIndex].events) {
                        data.story.content.body[newCalendarComponentIndex].events =
                  data.story.content.body[newCalendarComponentIndex].events.map(
                      (event: EventModel) => {
                          const { _editable, ...rest } = event;
                          return rest;
                      }
                  );
                    }
                    if (data.story.content.body[newCalendarComponentIndex].resources) {
                        data.story.content.body[newCalendarComponentIndex].resources =
                  data.story.content.body[newCalendarComponentIndex].resources.map(
                      (resource: ResourceModel) => {
                          const { _editable, ...rest } = resource;
                          return rest;
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

    const syncData = ({ store, action, record, records, changes }: SyncData) => {
        const storeId = store.id;

        if (storeId === 'events') {
            if (action === 'remove') {
                const storyDataState = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content.body.map((item: any) => {
                    if (item.component === 'calendar') {
                        item.events = item.events.filter(
                            (event: EventModel) => event.id !== record.id
                        );
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
                updateStory(updatedStory);
            }

            if (action === 'update') {
                const storyDataState = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content.body.map((item: any) => {
                    if (item.component === 'calendar') {
                        const existingEventIndex = item.events.findIndex(
                            (event: EventModel) => event.id === record.id
                        );

                        const eventData = {
                            id             : record.id,
                            _uid           : record._uid || crypto.randomUUID(),
                            name           : record.name,
                            startDate      : convertDateToSbFormat(`${record.startDate}`),
                            endDate        : convertDateToSbFormat(`${record.endDate}`),
                            component      : 'event',
                            resourceId     : record.resourceId,
                            readOnly       : record.readOnly || false,
                            draggable      : record.draggable !== false,
                            resizable      : record.resizable !== false,
                            allDay         : record.allDay || false,
                            exceptionDates : record.exceptionDates,
                            recurrenceRule : record.recurrenceRule,
                            cls            : record.cls,
                            eventColor     : record.eventColor,
                            eventStyle     : record.eventStyle,
                            iconCls        : record.iconCls,
                            style          : record.style
                        };

                        if (existingEventIndex >= 0) {
                            // Update existing event
                            item.events[existingEventIndex] = eventData;
                        }
                        else {
                            // Create new event (first update after add)
                            item.events.push(eventData);
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
                updateStory(updatedStory);
            }
        }

        if (storeId === 'resources') {
            if (action === 'remove') {
                const storyDataState = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content.body.map((item: any) => {
                    if (item.component === 'calendar') {
                        item.resources = item.resources.filter(
                            (resource: ResourceModel) => resource.id !== record.id
                        );
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
                updateStory(updatedStory);
            }

            if (action === 'update') {
                const storyDataState = JSON.parse(JSON.stringify(storyData));
                const content = storyDataState.content;
                const updatedContent = content.body.map((item: any) => {
                    if (item.component === 'calendar') {
                        const existingResourceIndex = item.resources.findIndex(
                            (resource: ResourceModel) => resource.id === record.id
                        );

                        const resourceData = {
                            id         : record.id,
                            _uid       : record._uid || crypto.randomUUID(),
                            name       : record.name,
                            eventColor : record.eventColor,
                            readOnly   : record.readOnly || false,
                            component  : 'resource'
                        };

                        if (existingResourceIndex >= 0) {
                            // Update existing resource
                            item.resources[existingResourceIndex] = resourceData;
                        }
                        else {
                            // Create new resource (first update after add)
                            item.resources.push(resourceData);
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
                updateStory(updatedStory);
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
            events={storyData?.content?.body[currCalendarComponentIndex]?.events}
            resources={storyData?.content?.body[currCalendarComponentIndex]?.resources}
            onDataChange={syncData}
            {...props}
        />
    );
}