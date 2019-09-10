import { combineLatest } from 'reactive-observables';
import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { findIndex } from 'lodash';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import createRawEventsObservable from 'in-subscription/rawEvents';
import EventsNavigator from 'in-views/eventView/EventsNavigator';
import EventDetails from 'in-views/eventView/EventDetails';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/events',
        name: 'eventId'
      }
    ],
    reducerName: 'onChange'
  }),
  connectTo(({ eventType }) => ({
    rawEventList: combineLatest([timeConfig$, query$]).flatMap(([timeConfig, query]) =>
      createRawEventsObservable({
        timeConfig,
        query: concatQueries(query, eventType),
        sortByField: 'start',
        sortMode: 'DESC',
        offset: 0,
        size: 200
      })
    )
  }))
)(EventTable);

function EventTable(props) {
  const { rawEventList, eventId, items, onChange } = props;
  if (!rawEventList) {
    return null;
  }
  return (
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <NavigatorSplitScreen
          {...props}
          items={rawEventList}
          navigator={<EventsNavigator eventId={eventId} rawEventList={rawEventList} onChange={onChange} />}
          typeLabel="event"
          openItemIndex={findIndex(items, item => item.event.id === eventId)}
          openItem={e => {
            onChange({
              eventId: e.event.id
            });
          }}
        >
          <EventDetails
            eventId={eventId}
            openItem={eventId => {
              onChange({
                eventId
              });
            }}
          />
        </NavigatorSplitScreen>
      </Sticky>
    </Fragment>
  );
}

function concatQueries(userQuery, eventFilter) {
  if (userQuery && eventFilter) {
    return `(${userQuery}) AND (event.type:${eventFilter})`;
  } else if (!userQuery && eventFilter) {
    return `event.type:${eventFilter}`;
  } else if (userQuery && !eventFilter) {
    return userQuery;
  }
  return '';
}
