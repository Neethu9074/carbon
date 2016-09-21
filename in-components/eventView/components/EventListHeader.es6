import {combineLatest} from 'reactive-observables';
import React from 'react';

import createTotalShedEventsSubscription from 'in-services/subscription/totalShedEventsCount';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {luceneQuery$ as query$} from 'in-stores/search';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';


const block = 'in-event-view-event-list-header';

export default function EventListHeader() {
  return (
    <ViewHeader className={block}>
      <h1 className={`${block}__title`}>
        Events (<Count />)
      </h1>
    </ViewHeader>
  );
}

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
