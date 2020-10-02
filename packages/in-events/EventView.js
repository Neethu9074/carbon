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
import { timeConfig$, getTimeConfig } from 'in-stores/time/config';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import EventsChart from 'in-events/components/EventsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import getRawEvents from 'in-subscription/getRawEvents';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import { seconds } from 'in-services/time';
import Sticky from 'in-components/Sticky';
import connect from 'in-hoc/connectTo';

export default function LegacyEventViewMigration(props) {
  const query = get(props, ['location', 'query']);
  const timeConfig = getTimeConfig(props.location);
  if (query.eventId) {
    return (
      <RedirectWithHash
        to$={getEventsViewFilteredBy({
          ...query,
          eventTypeFilter: getMatrixParameter(props.location, eventsPath, 'view'),
          timeConfig
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
      .flatMap(timeConfig =>
        timeConfig.autoRefresh
          ? mouseMoveSignal$
              .startWith(true)
              .throttle(1000)
              .flatMap(() => interval(seconds.toMillis(10)))
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
          <DashboardHeader
            icon="lib_events_inverted"
            label="Events"
            title={eventTypeLabels[eventType] ?? 'Events'}
            labelForTitle=""
          />
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
  const explicitEventFilter = getExplicitEventFilter(eventFilter);

  if (userQuery) {
    return `(${userQuery}) AND (${explicitEventFilter})`;
  }
  return explicitEventFilter;
}

function getExplicitEventFilter(eventFilter) {
  if (!eventFilter) {
    // If no eventFilter is set, this means "All" events selected but should filter Monitoring Events
    return `!event.type:agent_monitoring_issue`;
  } else if (eventFilter === 'change') {
    return 'event.type:change OR event.type:offline OR (event.type:online)';
  } else {
    return `event.type:${eventFilter}`;
  }
}
