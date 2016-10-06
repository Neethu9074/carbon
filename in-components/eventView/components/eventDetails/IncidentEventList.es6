import React from 'react';

import ListWrapper from 'in-components/eventView/components/eventDetails/EventDetails/ListWrapper';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/eventDetails/IncidentEventList.less';


const block = 'in-event-view-incident-event-list';

export default connectTo({
  events: sortedRecentEvents$
},
function IncidentEventList({events}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      <div className={`${block}__counter`}>
        {`Events (${events.length})`}
      </div>
      <div className={`${block}__timeline`}>
        <TimeMarker text='started' />

        {events.map(event => <ListWrapper key={event.get('id')}
                                          event={event}
                                          isCollapsed={true} />)
        }

        <TimeMarker text='ended' />
      </div>
    </div>
  );
});

function TimeMarker({text}) {
  return (
    <div className={`${block}__time-marker ${block}__time-marker__${text}`}>
      <LabeledValue label={text}
                    lightTheme={true} />
    </div>
  );
}
