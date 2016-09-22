import {combineLatest} from 'reactive-observables';
import React from 'react';

import createTotalShedEventsSubscription from 'in-services/subscription/totalShedEventsCount';
import {eventFilter$, setEventFilter} from 'in-components/eventView/stores/eventFilterStore';
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
               type={'dashboard'}
               width={20}
               height={20}
               color={'#33d8d7'} />

      <EventFilter filter='incidents'>
        Incidents (<Count />)
      </EventFilter>
      <EventFilter filter='events'>
        Events (<Count />)
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
         onClick={() => setEventFilter(filter)}>
      {children}
    </div>
  );
});

const Count = connectTo({
  totalShedEventsCount: combineLatest([timeframe$, query$])
                        .flatMap(([timeframe, query]) => createTotalShedEventsSubscription({timeframe, query}))
}, ({totalShedEventsCount}) => {
  if (!totalShedEventsCount) {
    return (
      <LoadingIndicator inline={true}
                               style={{
                                 height: '.375rem'
                               }} />
    );
  }
  return (
    <span>
      {totalShedEventsCount}
    </span>
  );
});
