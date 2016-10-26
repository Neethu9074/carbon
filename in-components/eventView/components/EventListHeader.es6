import React from 'react';

import {eventFilter$, setEventTypeFilter} from 'in-components/eventView/stores/eventFilterStore';
import {toggleAutoUpdate, autoUpdate$} from 'in-components/eventView/stores/autoUpdate';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {refresh} from 'in-components/eventView/stores/rawEventListStore';
import getTotalRawEventsCount from 'in-stores/totalRawEventsCount';
import LoadingIndicator from 'in-components/LoadingIndicator';
import AutoUpdate from 'in-components/AutoUpdate';
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

        <EventFilter>
          All (<Count getCounter={counter => counter.get('incident', 0) + counter.get('issue', 0)}/>)
        </EventFilter>
        <EventFilter filter='incident'>
          Incidents (<Count getCounter={counter => counter.get('incident', 0)}/>)
        </EventFilter>
        <EventFilter filter='event'>
          Events (<Count getCounter={counter => counter.get('issue', 0)}/>)
        </EventFilter>
      </div>
      <div className={`${block}__right-side`}>
        <SvgIcon className={`${block}__refresh`}
                 type='refresh'
                 onClick={refresh}
                 height={15} />
        <AutoUpdate checkboxId='event-view-auto-update'
                    autoUpdate$={autoUpdate$}
                    toggleAutoUpdate={toggleAutoUpdate} />
      </div>
    </ViewHeader>
  );
}

const EventFilter = connectTo({
  eventFilter: eventFilter$
}, function EventFilter({eventFilter, children, filter}) {
  let className = `${block}__title`;
  if ((filter && eventFilter === filter) || (!eventFilter && !filter)) {
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
  eventCounter: getTotalRawEventsCount()
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
