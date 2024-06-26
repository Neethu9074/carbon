/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import {
  eventIdUrlParameter,
  orderDirectionParameter,
  orderByUrlParameter,
  pageNumberUrlParameter
} from 'in-events/navigation/urlParameters';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { highlightedTimeframe$ } from 'in-stores/highlightedTimeframe';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { spreadTimeConfig, concatQueries } from 'in-events/utils';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import RedirectWithHash from 'in-components/RedirectWithHash';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import EventsChart from 'in-events/components/EventsChart';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import getRawEvents from 'in-subscription/getRawEvents';
import { getTimeConfig } from 'in-stores/time/config';
import { Row, Col } from 'in-components/layout/Grid';
import { query$ } from 'in-stores/search/query';
import useUrlState from 'in-hooks/useUrlState';
import { getEvent } from 'in-stores/events';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LegacyEventViewMigration(props) {
  const query = get(props, ['location', 'query']);
  const eventId = getMatrixParameter(props.location, eventsPath, 'eventId');

  const eventObservable = getEvent(eventId ?? '').map(data => ({
    data,
    errors: [],
    progress: { percentage: null, loading: false }
  }));
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

  return <EventView {...props} eventType={eventType} eventId={eventId} eventObservable={eventObservable} />;
}
const urlSettingsConfig = {
  bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter, pageNumberUrlParameter],
  replaceHistory: false
};

function EventView(props) {
  const { mouseMoveSignal$, modifiedTimeConfig$ } = useModifiedTimeConfig();

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
