import {combineLatest} from 'reactive-observables';
import React from 'react';

import {eventFilter$, setEventTypeFilter} from 'in-components/eventView/stores/eventFilterStore';
import createTotalShedEventsSubscription from 'in-services/subscription/totalShedEventsCount';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {luceneQuery$ as query$} from 'in-stores/search';
import {timeframe$} from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';


const block = 'in-event-view-event-list-header';

export default function EventListHeader() {
  return (
    <ViewHeader className={block}>
      <SvgIcon className={`${block}__icon`}
               type={'danger_sign'}
               width={20}
               height={20}
               color={'#33d8d7'} />

      <EventFilter filter='incident'>
        Incidents (<Count getCounter={counter => counter.get('incident')}/>)
      </EventFilter>
      <EventFilter filter='event'>
        Events (<Count getCounter={counter => counter.get('issue')}/>)
      </EventFilter>
    </ViewHeader>
  );
}

const EventFilter = connectTo({
  eventFilter: eventFilter$
},
({eventFilter, children, filter}) => {
  let className = `${block}__title`;
  if (eventFilter === filter) {
    className += ` ${className}--selected`;
  }

  return (
    <div className={className}
         onClick={() => setEventTypeFilter(filter)}>
      {children}
    </div>
  );
});

const Count = connectTo({
  totalShedEventsCounter: combineLatest([timeframe$, query$])
                          .flatMap(([timeframe, query]) => createTotalShedEventsSubscription({timeframe, query}))
}, ({getCounter, totalShedEventsCounter}) => {
  if (!totalShedEventsCounter) {
    return (
      <LoadingIndicator inline={true}
                               style={{
                                 height: '.375rem'
                               }} />
    );
  }
  return (
    <span>
      {getCounter(totalShedEventsCounter)}
    </span>
  );
});
