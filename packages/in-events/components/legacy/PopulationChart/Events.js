import React from 'react';

import Event from 'in-events/components/legacy/PopulationChart/Event';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getEventType, EVENT_TYPES } from 'in-stores/events';

import './Events.less';

const block = 'in-event-view-detail-chart-events';

export default function Events({ scale, recentEvents, isExpanded, changesAreVisible = true }) {
  if (!recentEvents) {
    return (
      <div className={block}>
        <LoadingIndicator type="dark" style={{ height: '1rem' }} />
      </div>
    );
  }

  recentEvents = changesAreVisible
    ? recentEvents
    : recentEvents.filter(_event => getEventType(_event) !== EVENT_TYPES.CHANGE);

  const maxEventsToShowOnCollapse = 10;
  recentEvents = isExpanded ? recentEvents : recentEvents.slice(0, maxEventsToShowOnCollapse);

  return (
    <div className={block}>
      {recentEvents.map(event => (
        <Event key={event.get('id')} event={event} scale={scale} />
      ))}
    </div>
  );
}
