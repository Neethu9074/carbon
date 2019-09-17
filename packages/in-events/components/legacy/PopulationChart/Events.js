import React from 'react';

import Event from 'in-events/components/legacy/PopulationChart/Event';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './Events.less';

const block = 'in-event-view-detail-chart-events';

export default connectTo(
  ({ getRecentEvents$ }) => ({
    events: getRecentEvents$()
  }),
  function Events({ scale, events, isExpanded, changesAreVisible = true }) {
    if (!events) {
      return (
        <div className={block}>
          <LoadingIndicator type="dark" style={{ height: '1rem' }} />
        </div>
      );
    }

    events = changesAreVisible ? events : events.filter(_event => getEventType(_event) !== EVENT_TYPES.CHANGE);
    events = isExpanded ? events : events.slice(0, 10);

    return (
      <div className={block}>
        {events.map(event => (
          <Event key={event.get('id')} event={event} scale={scale} />
        ))}
      </div>
    );
  }
);
