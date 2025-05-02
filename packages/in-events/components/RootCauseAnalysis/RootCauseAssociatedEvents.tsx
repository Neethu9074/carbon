/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Typography, CarbonLayer, Collapsible } from '@instana/components';
import { Event } from '@instana/types';

import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import { trackRcaClick } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { EVENT_RCA_ASSOCIATED_EVENTS_CLICK } from 'in-services/tracking/tracking';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { RawEvent } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface AssociatedEventsProps {
  rootCause: RootCause;
  incident: Event;
}

export default function AssociatedEvents({ rootCause, incident }: AssociatedEventsProps) {
  const userTimeConfig = useTimeConfig();

  const { location } = useNavigation();
  const steadyId = rootCause.entityID.steadyId;
  const pluginId = rootCause.entityID.pluginId;
  const hostIdValue = rootCause.entityID.host;
  const rcaEntityType = determineEntityTypeFromEntityIDMap(rootCause.entityID);

  const { selectedRootCause: rootCauseTab } = useContext(SelectedRootCauseContext);
  const probabilityScore = rootCause.probFailure;
  const rcaTrackingData = {
    incident,
    location,
    rootCauseTab,
    rcaEntityType,
    probabilityScore
  };

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
          const payload = { expanded: true };
          trackRcaClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_ASSOCIATED_EVENTS_CLICK, payload });
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
