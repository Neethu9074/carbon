import React from 'react';

import {eventFilter$, setEventTypeFilter} from 'in-components/eventView/stores/eventFilterStore';
import createTotalRawEventsSubscription from 'in-services/subscription/totalRawEventsCount';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {refresh} from 'in-components/eventView/stores/rawEventListStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {timeframe$} from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';


const block = 'in-event-view-event-list-header';

export default function EventListHeader() {
  return (
    <ViewHeader className={block}>
      <div className={`${block}__left-side`}>
        <SvgIcon className={`${block}__icon`}
                 type='danger_sign'
                 width={20}
                 height={20}
                 color='#33d8d7' />

        <EventFilter filter='incident'>
          Incidents (<Count getCounter={counter => counter.get('incident')}/>)
        </EventFilter>
        <EventFilter filter='event'>
          Events (<Count getCounter={counter => counter.get('issue')}/>)
        </EventFilter>
      </div>
      <div className={`${block}__right-side`}>
        <SvgIcon className={`${block}__refresh`}
                 type='refresh'
                 onClick={refresh}
                 height={15} />
      </div>
    </ViewHeader>
  );
}

const EventFilter = connectTo({
  eventFilter: eventFilter$
}, function EventFilter({eventFilter, children, filter}) {
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
  eventCounter: timeframe$.flatMap(timeframe => createTotalRawEventsSubscription({timeframe}))
}, function Count({getCounter, eventCounter}) {
  if (!eventCounter) {
    return (
      <LoadingIndicator inline={true}
                               style={{
                                 height: '.375rem'
                               }} />
    );
  }
  return (
    <span>
      {getCounter(eventCounter)}
    </span>
  );
});
