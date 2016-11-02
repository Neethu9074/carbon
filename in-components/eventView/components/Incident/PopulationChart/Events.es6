import React from 'react';

import {maxEventsOnCollapsed, isExpanded$} from 'in-components/eventView/stores/populationChartExpandedStore';
import {changesAreVisible$} from 'in-components/eventView/stores/changesVisibilityStore';
import Event from 'in-components/eventView/components/Incident/PopulationChart/Event';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './Events.less';


const block = 'in-event-view-detail-chart-events';

export default connectTo({
  changesAreVisible: changesAreVisible$,
  events: sortedRecentEvents$,
  isExpanded: isExpanded$
},
function Events({scale, events, isExpanded, changesAreVisible}) {
  if (!events) {
    return (
      <div className={block}>
        <LoadingIndicator type='dark'
                          style={{ height: '1rem' }} />
      </div>
    );
  }

  events = changesAreVisible
    ? events
    : events.filter(_event => getEventType(_event) !== EVENT_TYPES.CHANGE);

  events = isExpanded ? events : events.slice(0, maxEventsOnCollapsed);

  return (
    <div className={block}>
      {events.map(event => <Event key={event.get('id')}
                                  event={event}
                                  scale={scale} />
      )}
    </div>
  );
});
