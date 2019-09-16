import { combineLatest } from 'reactive-observables';
import { compose } from 'recompose';
import { findIndex } from 'lodash';
import React from 'react';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import createRawEventsObservable from 'in-subscription/rawEvents';
import EventsList from 'in-events/components/EventsList';
import { eventsPath } from 'in-events/navigation/paths';
import { getIconTypeForEvent } from 'in-stores/events';
import { eventId } from 'in-events/navigation/matrix';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import tabs from 'in-events/components/tabs/index';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { getEvent } from 'in-stores/events';
import Link from 'in-components/Link';

import locals from './EventTable.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: eventsPath,
        name: eventId
      },
      {
        path: eventsPath,
        name: 'orderDirection',
        initialState: 'DESC'
      },
      {
        path: eventsPath,
        name: 'orderBy',
        initialState: 'start'
      }
    ],
    reducerName: 'onChange'
  }),
  cursorPaginated({
    getResettingProps: () => ['orderBy', 'orderDirection', 'eventType'],
    get: ({ cursor, orderBy, orderDirection, eventType }) =>
      combineLatest([timeConfig$, query$]).flatMap(([timeConfig, query]) =>
        createRawEventsObservable({
          timeConfig,
          query: concatQueries(query, eventType),
          sortByField: orderBy,
          sortMode: orderDirection,
          offset: cursor,
          size: 20
        }).map(items => ({
          progress: { loading: false },
          errors: [],
          data: { items, canLoadMore: items.length === 20 }
        }))
      )
  })
)(EventTable);

function EventTable(props) {
  const { selectedEventId, items: rawEventList, items, onChange, canLoadMore, loadMore } = props;

  if (!rawEventList) {
    return null;
  }

  function onItemClicked(eventId) {
    onChange({ eventId: selectedEventId === eventId ? null : eventId });
  }

  if (!selectedEventId) {
    return (
      <EventsList
        rawEventList={rawEventList}
        onItemClicked={onItemClicked}
        canLoadMore={canLoadMore}
        loadMore={loadMore}
      />
    );
  }
  return (
    <NavigatorSplitScreen
      {...props}
      items={rawEventList}
      navigator={
        <EventsList
          selectedEventId={selectedEventId}
          rawEventList={rawEventList}
          onItemClicked={onItemClicked}
          canLoadMore={canLoadMore}
          loadMore={loadMore}
        />
      }
      typeLabel="event"
      openItemIndex={findIndex(items, event => event.id === selectedEventId)}
    >
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getEvent(selectedEventId).map(data => ({
          data,
          errors: [],
          progress: { percentage: null, loading: false }
        }))}
        props={props}
        withoutBreadcrumb
        useFullAvailableWidth
        withoutPadding
      />
    </NavigatorSplitScreen>
  );
}

function Header(props) {
  return (
    <div className={locals.header}>
      {!props.result ? (
        <BasicDashboardHeader title="Event" result={{ data: null }} />
      ) : (
        <BasicDashboardHeader
          title="Event"
          renderIcon={() => renderIcon(props.result.data)}
          getLabel={() => props.result.data.getIn(['problem', 'problemText'], '')}
          renderActions={Actions}
        />
      )}
    </div>
  );
}

function Actions() {
  return (
    <Link href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, eventId, null))}>
      <Tooltip content="Close event detail">
        <SvgIcon className={locals.closeIcon} aria-label="Close event detail" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}

function renderIcon(event) {
  return <SvgIcon className={locals.headingIcon} type={getIconTypeForEvent(event)} size="xs" />;
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
