/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create, just, interval } from '@instana/observables';
import React, { useState, useMemo } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import { eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter } from 'in-events/navigation/urlParameters';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { timeConfig$, getTimeConfig } from 'in-stores/time/config';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import RedirectWithHash from 'in-components/RedirectWithHash';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import EventsChart from 'in-events/components/EventsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import getRawEvents from 'in-subscription/getRawEvents';
import useObservable from 'in-hooks/useObservable';
import { query$ } from 'in-stores/search/query';
import useUrlState from 'in-hooks/useUrlState';
import { seconds } from 'in-services/time';
import Sticky from 'in-components/Sticky';

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
const urlSettingsConfig = {
  bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter],
  replaceHistory: false
};

function EventView(props) {
  const [mouseMoveSignal$] = useState(create());
  const [modifiedTimeConfig$] = useState(
    timeConfig$
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
  );

  const timeConfig = useObservable(modifiedTimeConfig$, []);
  const highlightedTimeframe = useObservable(highlightedTimeframe$.debounce(500), []);
  const query = useObservable(query$, []);

  const staticTimeConfigToUseForTable = useMemo(() => {
    if (!highlightedTimeframe) {
      return null;
    }
    return {
      to: highlightedTimeframe[1],
      focusedMoment: highlightedTimeframe[1],
      windowSize: highlightedTimeframe[1] - highlightedTimeframe[0],
      autoRefresh: false
    };
  }, [highlightedTimeframe]);
  const isPresentingHighlightedTimeframe = !!highlightedTimeframe;

  const [urlState, onChange] = useUrlState(urlSettingsConfig);

  if (!timeConfig) {
    return null;
  }

  return (
    <EventViewComponent
      {...props}
      isPresentingHighlightedTimeframe={isPresentingHighlightedTimeframe}
      staticTimeConfigToUseForTable={staticTimeConfigToUseForTable}
      highlightedTimeframe={highlightedTimeframe}
      mouseMoveSignal$={mouseMoveSignal$}
      timeConfig={timeConfig}
      onChange={onChange}
      query={query}
      {...urlState}
    />
  );
}

function EventViewComponent(props) {
  const { eventType, staticTimeConfigToUseForTable, orderBy, orderDirection, query, eventId, timeConfig } = props;

  const tableProps = useCursorPagination(
    ({ cursor }) =>
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
      }),
    [
      eventType,
      query,
      orderBy,
      orderDirection,
      eventType,
      ...spreadTimeConfig(staticTimeConfigToUseForTable, timeConfig)
    ]
  );

  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            icon="lib_events_inverted"
            label={t('in-events:titleEvent')}
            title={eventTypeLabels[eventType] ?? t('in-events:titleEvent')}
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
        <EventTable {...props} {...tableProps} eventType={eventType} selectedEventId={eventId} />
      ) : (
        <LeftRightPadding>
          <Row>
            <Col lg={12}>
              <EventsChart eventType={eventType} query={query} timeConfig={timeConfig} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <EventTable {...props} {...tableProps} eventType={eventType} />
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
    return 'event.type:changeAndPresence';
  } else {
    return `event.type:${eventFilter}`;
  }
}

function spreadTimeConfig(staticTimeConfigToUseForTable, timeConfig) {
  timeConfig = staticTimeConfigToUseForTable ?? timeConfig;
  return [timeConfig.to, timeConfig.windowSize, timeConfig.autoRefresh, timeConfig.focusedMoment];
}
