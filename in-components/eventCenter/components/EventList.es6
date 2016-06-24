import Immutable from 'immutable';
import moment from 'moment';
import React from 'react';

import {openEventsAtServerTime$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventCenter/components/EventList.less';


const block = 'in-event-center-list';

export default connectTo({
    openEventsAtServerTime: openEventsAtServerTime$.map(events => {
      let result = [];

      result = result.concat(events.issues);
      result = result.concat(events.incidents);
      result = result.concat(events.changes);

      return Immutable.List(result);
    })
  },
  function EventCenter({openEventsAtServerTime}) {
    if (!openEventsAtServerTime) {
      return null;
    }

    const sortedEvent = openEventsAtServerTime.sort((a, b) => b.get('start') - a.get('start'));

    const days = getEventsPerDay(sortedEvent);
    const dailyEvents = Object.keys(days);

    return (
      <ul className={block}>
        {dailyEvents.map(key => {
          const events = days[key];
          return (
            <li key={key}>
              {getDayStringForDate(key)}

              <ul>
                {events.map(event =>
                  <li key={event.get('id')}>
                    {event.get('id')}
                  </li>)
                }
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }
);

function getEventsPerDay(events) {
  const days = {};

  events.forEach(event => {
    const eventStartingDate = new Date(event.get('start'));
    const dateString = getDateString(eventStartingDate);
    if (!days[dateString]) {
      days[dateString] = [];
    }
    days[dateString].push(event);
  });

  return days;
}

function getDayStringForDate(dateString) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (dateString === getDateString(today)) {
    return 'Today';
  } else if (dateString === getDateString(yesterday)) {
    return 'Yesterday';
  }
  return dateString;
}

function getDateString(date) {
  return moment(date).format('YYYY-MM-DD');
}
