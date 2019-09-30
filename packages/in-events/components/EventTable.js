import { compose } from 'recompose';
import { findIndex } from 'lodash';
import React from 'react';

import { eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter } from 'in-events/navigation/urlParameters';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { isAppDataEntityType } from 'in-services/entityUtils';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import EventsList from 'in-events/components/EventsList';
import getRawEvents from 'in-subscription/getRawEvents';
import { eventsPath } from 'in-events/navigation/paths';
import EventIcon from 'in-events/components/EventIcon';
import { eventId } from 'in-events/navigation/matrix';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import tabs from 'in-events/components/tabs/index';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { getEvent } from 'in-stores/events';
import Pill from 'in-new-components/Pill';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './EventTable.mless';

export default compose(
  connect({
    timeConfig: timeConfig$,
    query: query$
  }),
  withUrlState({
    bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter],
    reducerName: 'onChange'
  }),
  cursorPaginated({
    getResettingProps: () => ['orderBy', 'orderDirection', 'eventType', 'timeConfig', 'query'],
    get: ({ cursor, orderBy, orderDirection, timeConfig, query, eventType }) =>
      getRawEvents({
        timeConfig,
        query: concatQueries(query, eventType),
        pagination: {
          cursor,
          retrievalSize: 30
        },
        order: {
          by: orderBy,
          direction: orderDirection
        }
      }).map(data => ({
        progress: { loading: false },
        errors: [],
        data
      }))
  })
)(EventTable);

function EventTable(props) {
  const { selectedEventId, items: rawEventList, items, onChange } = props;

  if (!rawEventList) {
    return null;
  }

  function onItemClicked(eventId) {
    onChange({ eventId: selectedEventId === eventId ? null : eventId });
  }

  if (!selectedEventId) {
    return <EventsList {...props} onItemClicked={onItemClicked} />;
  }
  return (
    <NavigatorSplitScreen
      {...props}
      items={rawEventList}
      navigator={<EventsList {...props} onItemClicked={onItemClicked} />}
      typeLabel="event"
      openItemIndex={findIndex(items, event => event.id === selectedEventId)}
      openItem={e => onChange({ eventId: e.id })}
      totalRepresentedItemCount={rawEventList.length}
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
          renderActions={() => renderActions(props.result.data)}
        />
      )}
    </div>
  );
}

function renderActions(event) {
  return (
    <>
      <TriggeredMarker event={event} />
      <Link href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, eventId, null))}>
        <Tooltip content="Close event detail">
          <SvgIcon className={locals.closeIcon} aria-label="Close event detail" type="lib_openclose_cancel" />
        </Tooltip>
      </Link>
    </>
  );
}

function TriggeredMarker({ event }) {
  return getEventType(event) !== EVENT_TYPES.INCIDENT && hasServiceImpact(event) ? (
    <Pill color={theme.lib.colors.cyan800}>Service impact</Pill>
  ) : null;
}

function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}

function renderIcon(event) {
  return <EventIcon className={locals.icon} event={event} size="s" />;
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
