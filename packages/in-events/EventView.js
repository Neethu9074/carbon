/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useCallback } from 'react';
import { get, isEmpty } from 'lodash';

import { ChatContainer } from '@instana/ai-chat';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { Stack } from '@instana/components';

// This function returns a React component for user defined responses.
import {
  eventIdUrlParameter,
  orderDirectionParameter,
  orderByUrlParameter,
  filterParameter
} from 'in-events/navigation/urlParameters';
// This function hooks up to your back-end.
import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
import EditableOptions from 'in-events/components/AIChat/EditableOptions';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { highlightedTimeframe$ } from 'in-stores/highlightedTimeframe';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { spreadTimeConfig, concatQueries } from 'in-events/utils';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { eventsAIChatEnabled } from 'in-services/featureFlags';
import RedirectWithHash from 'in-components/RedirectWithHash';
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import EventsChart from 'in-events/components/EventsChart';
import EventTable from 'in-events/components/EventTable';
import { pendingResult } from 'in-services/fixedObjects';
import { eventsPath } from 'in-events/navigation/paths';
import getRawEvents from 'in-subscription/getRawEvents';
import { getTimeConfig } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import useUrlState from 'in-hooks/useUrlState';
import { getEvent } from 'in-stores/events';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LegacyEventViewMigration(props) {
  const query = get(props, ['location', 'query']);
  const eventId = getMatrixParameter(props.location, eventsPath, 'eventId');

  let eventObservable;
  if (eventId) {
    eventObservable = getEvent(eventId ?? '').map(data => ({
      data,
      errors: [],
      progress: { percentage: null, loading: false }
    }));
  } else {
    eventObservable = just(pendingResult);
  }
  const timeConfig = getTimeConfig(props.location);

  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const redirectWithHashTo = getEventsViewFilteredBy({
    ...query,
    eventTypeFilter: getMatrixParameter(props.location, eventsPath, 'view'),
    timeConfig
  });
  if (query.eventId) {
    return <RedirectWithHash to={redirectWithHashTo} />;
  }

  const eventType = getMatrixParameter(props.location, eventsPath, 'view');

  return <EventView {...props} eventType={eventType} eventId={eventId} eventObservable={eventObservable} />;
}
const urlSettingsConfig = {
  bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter, filterParameter],
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
  const {
    eventType,
    staticTimeConfigToUseForTable,
    orderBy,
    orderDirection,
    query,
    eventId,
    timeConfig,
    filter,
    onChange
  } = props;

  // Configuration to be passed to the AI Chat
  const config = {
    messaging: {
      disablePDFViewer: true,
      customSendMessage: CustomSendMessages
    }
  };
  // Table sort for AI Chat
  function customSortRow(lhs, rhs, collator) {
    const nlhs = Number(lhs);
    const nrhs = Number(rhs);
    if (!Number.isNaN(nlhs) && !Number.isNaN(nrhs)) {
      return nlhs - nrhs;
    }
    return collator.compare(lhs, rhs);
  }
  function setCustomSortRow() {
    const tables = document.querySelector('cds-aichat-internal').shadowRoot.querySelectorAll('cds-aichat-table');
    // NodeList needs to be [] to iterate
    [...tables].forEach(elm => {
      const table = elm.shadowRoot.querySelector('cds-table');
      if (table && !table.hasCustomSort) {
        table.customSortRow = customSortRow;
        table.hasCustomSort = true;
      }
    });
  }

  const fetchEvents = useCallback(
    ({ cursor }) => {
      // Combine filters and query if present
      let queries = [];
      if (!isEmpty(query)) {
        queries.push(query);
      }
      if (!isEmpty(filter) && (eventType === 'issue' || eventType === 'incident')) {
        queries.push(filter);
      }
      queries = queries.map(q => `(${q})`).join(' AND ');
      // End combine filters

      return eventType === 'cve_issue'
        ? getRawCVEEvents({
            timeConfig: staticTimeConfigToUseForTable || timeConfig,
            query: concatQueries(queries, eventType),
            pagination: {
              cursor,
              retrievalSize: 30
            },
            order: {
              by: orderBy,
              direction: orderDirection
            }
          })
        : getRawEvents({
            timeConfig: staticTimeConfigToUseForTable || timeConfig,
            query: concatQueries(queries, eventType),
            pagination: {
              cursor,
              retrievalSize: 30
            },
            order: {
              by: orderBy,
              direction: orderDirection
            }
          });
    },
    [eventType, query, orderBy, orderDirection, staticTimeConfigToUseForTable, timeConfig, filter]
  );
  const tableProps = useCursorPagination(fetchEvents, [
    eventType,
    query,
    orderBy,
    orderDirection,
    eventType,
    filter,
    ...spreadTimeConfig(staticTimeConfigToUseForTable, timeConfig)
  ]);
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
            <ViewSwitcher onChange={onChange} selectedEventType={eventType} />
          </DashboardHeaderModule>
          {!eventId && <DashboardHeaderShadowModule />}
        </>
      }
    >
      {eventId ? (
        <EventTable {...props} {...tableProps} eventType={eventType} selectedEventId={eventId} />
      ) : (
        <LeftRightPadding>
          <Stack gap="normal">
            <EventsChart eventType={eventType} query={query} timeConfig={timeConfig} />
            <EventTable {...props} {...tableProps} eventType={eventType} />
          </Stack>
        </LeftRightPadding>
      )}
      {eventsAIChatEnabled && (
        <ChatContainer
          config={config}
          onBeforeRender={instance => {
            instance.on({
              type: 'receive',
              handler: msg => {
                if (msg.data?.output?.generic?.[0]?.response_type === 'table') {
                  // Wait for table to display
                  setTimeout(() => {
                    setCustomSortRow();
                  }, 500);
                }
              }
            });
            // HACK -- To keep the greeting message from popping up we add a LONG delay.
            // TODO -- Update this once aichat packages version bumps where new function
            // allows you to cancel all together
            instance.showLauncherGreetingMessage(100000000000000, 'desktop');
          }}
          renderUserDefinedResponse={({ messageItem }, instance) => {
            if (!messageItem) {
              return;
            }
            switch (messageItem.user_defined?.user_defined_type) {
              case `editable_options`:
                return <EditableOptions messageItem={messageItem} instance={instance} />;
              default:
                return undefined;
            }
          }}
        />
      )}
    </Sticky>
  );
}
