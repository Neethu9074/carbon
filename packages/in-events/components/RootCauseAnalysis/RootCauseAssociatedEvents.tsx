/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, CarbonLayer, Collapsible } from '@instana/components';

//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import { EVENT_RCA_ASSOCIATED_EVENTS_CLICK } from 'in-services/tracking/tracking';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { RawEvent } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface AssociatedEventsProps {
  rootCause: RootCause;
}

export default function AssociatedEvents({ rootCause }: AssociatedEventsProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const userTimeConfig = useTimeConfig();

  const steadyId = rootCause.entityID.steadyId;
  const pluginId = rootCause.entityID.pluginId;
  const hostIdValue = rootCause.entityID.host;

  const {
    items: rawAssociatedEvents,
    canLoadMore,
    loadMore,
    totalHits: rawAssociatedEventsCount,
    progress: { loading: rawAssociatedEventsLoading }
  } = useCursorPagination(
    ({ cursor }) =>
      getRawEvents({
        timeConfig: userTimeConfig,
        // TODO: enhance this query to add user changable filters
        query: `(event.steadyId:"${steadyId}") AND (event.pluginId:"${pluginId}") AND (event.host:"${hostIdValue}") AND !event.type:prc_issue`,
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }),
    [rootCause.entityID]
  );

  return (
    <CarbonLayer>
      <Collapsible
        onOpen={() => {
          const instrumentationEventProperties = { expanded: true };
          trackCta(EVENT_RCA_ASSOCIATED_EVENTS_CLICK, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
        }}
      >
        <Collapsible.Header>
          <Typography variant="body-regular">
            {t('in-events:RCA.relatedEventsLabel', {
              number_of_events: rawAssociatedEventsCount || 0
            })}
          </Typography>
        </Collapsible.Header>
        <Collapsible.Content>
          <div className={locals.accordionContent}>
            <EventsDatagrid
              events={rawAssociatedEvents as RawEvent[]}
              loading={rawAssociatedEventsLoading}
              loadMore={loadMore}
              canLoadMore={canLoadMore}
            />
          </div>
        </Collapsible.Content>
      </Collapsible>
    </CarbonLayer>
  );
}
