import React from 'react';

import Event from 'in-components/eventView/components/eventDetails/IncidentPopulationChart/Event';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './Events.less';


const block = 'in-event-view-detail-chart-events';

export default connectTo({
  events: sortedRecentEvents$
},
function Events({scale, events}) {
  if (!events) {
    return (
      <div className={block}>
        <LoadingIndicator type='dark'
                          style={{
                            height: '1rem'
                          }} />
      </div>
    );
  }

  return (
    <div className={block}>
      {events.map(event => {
        return (
          <Event key={event.get('id')}
                 event={event}
                 scale={scale} />
        );
      })}
    </div>
  );
});
