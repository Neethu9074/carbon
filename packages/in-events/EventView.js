import { compose, withPropsOnChange, withState } from 'recompose';
import { create, just, interval } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter } from 'in-events/navigation/urlParameters';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import EventsChart from 'in-events/components/EventsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import getRawEvents from 'in-subscription/getRawEvents';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import SearchBar from 'in-components/SearchBar';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import Sticky from 'in-components/Sticky';
import connect from 'in-hoc/connectTo';

export default function LegacyEventViewMigration(props) {
  const legacyEventIdQueryParam = get(props, ['location', 'query', 'eventId']);
  if (legacyEventIdQueryParam) {
    return (
      <RedirectWithHash
        to$={getEventsViewFilteredBy({
          eventTypeFilter: getMatrixParameter(props.location, eventsPath, 'view'),
          eventId: legacyEventIdQueryParam
        })}
      />
    );
  }

  const eventType = getMatrixParameter(props.location, eventsPath, 'view');
  const eventId = getMatrixParameter(props.location, eventsPath, 'eventId');

  return <EventView {...props} eventType={eventType} eventId={eventId} />;
}

const EventView = compose(
  withState('mouseMoveSignal$', 'setSignal', create()),
  withPropsOnChange(['mouseMoveSignal$'], ({ mouseMoveSignal$ }) => ({
    timeConfig$: timeConfig$
      .flatMap(
        timeConfig =>
          timeConfig.autoRefresh
            ? mouseMoveSignal$
                .startWith(true)
                .throttle(1000)
                .flatMap(() => interval(1000 * 10))
                .map(() => timeConfig)
                .startWith(timeConfig)
            : just(timeConfig)
      )
      .startWith(timeConfig$)
      .map(timeConfig => {
        // make sure, the event view is not updating any data automatically
        const to = timeConfig.to || Date.now();
        return {
          to,
          focusedMoment: to,
          autoRefresh: false,
          windowSize: timeConfig.windowSize
        };
      })
  })),
  connect(({ timeConfig$ }) => ({
    timeConfig: timeConfig$,
    highlightedTimeframe: highlightedTimeframe$.debounce(500),
    query: query$
  })),
  withPropsOnChange(['highlightedTimeframe'], ({ highlightedTimeframe }) => {
    if (highlightedTimeframe) {
      return {
        staticTimeConfigToUseForTable: {
          to: highlightedTimeframe[1],
          focusedMoment: highlightedTimeframe[1],
          autoRefresh: false,
          windowSize: highlightedTimeframe[1] - highlightedTimeframe[0]
        },
        isPresentingHighlightedTimeframe: true
      };
    }
  }),
  withUrlState({
    bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter],
    reducerName: 'onChange',
    replaceHistory: false
  }),
  cursorPaginated({
    getResettingProps: () => [
      'orderBy',
      'orderDirection',
      'eventType',
      'timeConfig',
      'staticTimeConfigToUseForTable',
      'query'
    ],
    get: ({ cursor, orderBy, orderDirection, timeConfig, staticTimeConfigToUseForTable, query, eventType }) =>
      getRawEvents({
        timeConfig: staticTimeConfigToUseForTable || timeConfig,
        query: concatQueries(query, eventType),
        pagination: {
          cursor,
          retrievalSize: 30
        },
        order: {
          by: orderBy,
          direction: orderDirection
        }
      })
  })
)(EventViewComponent);

function EventViewComponent(props) {
  const { eventType, query, eventId, timeConfig } = props;

  return (
    <Sticky
      header={
        <>
          <DashboardHeader icon="lib_infrastructure" label="Events" title="Events" />
          <DashboardHeaderModule>
            <SearchBar />
          </DashboardHeaderModule>
          <DashboardHeaderModule theme={themes.light} withBottomBorder={eventId}>
            <ViewSwitcher selectedEventType={eventType} />
          </DashboardHeaderModule>
          {!eventId && <DashboardHeaderShadowModule />}
        </>
      }
    >
      {eventId ? (
        <EventTable {...props} eventType={eventType} selectedEventId={eventId} />
      ) : (
        <LeftRightPadding>
          <Row>
            <Col lg={12}>
              <EventsChart eventType={eventType} query={query} timeConfig={timeConfig} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <EventTable {...props} eventType={eventType} />
            </Col>
          </Row>
        </LeftRightPadding>
      )}
    </Sticky>
  );
}

function concatQueries(userQuery, eventFilter) {
  if (userQuery && eventFilter) {
    return `(${userQuery}) AND (${getExplicitEventFilter(eventFilter)})`;
  } else if (!userQuery && eventFilter) {
    return getExplicitEventFilter(eventFilter);
  } else if (userQuery && !eventFilter) {
    return userQuery;
  }
  return '';
}

function getExplicitEventFilter(eventFilter) {
  if (eventFilter === 'change') {
    return 'event.type:change OR event.type:offline OR (event.type:online)';
  }
  return `event.type:${eventFilter}`;
}
