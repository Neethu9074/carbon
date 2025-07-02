/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { FC, useContext } from 'react';

import { CarbonLayer } from '@instana/components';

import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { RawEvent } from 'in-types';

const RootCauseAssociatedEvents: FC = () => {
  const userTimeConfig = useTimeConfig();

  const { selectedEntityId } = useEntitySelection();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);
  const entityID = rootCauseMetadata[rootCauseIndex]?.entityID || {
    steadyId: '',
    pluginId: '',
    host: ''
  };
  const { steadyId, pluginId, host } = entityID;

  const {
    items: rawAssociatedEvents,
    canLoadMore,
    loadMore,
    progress: { loading: rawAssociatedEventsLoading }
  } = useCursorPagination(
    ({ cursor }) =>
      getRawEvents({
        timeConfig: userTimeConfig,
        // TODO: enhance this query to add user changable filters
        query: `(event.steadyId:"${steadyId}") AND (event.pluginId:"${pluginId}") AND (event.host:"${host}") AND !event.type:prc_issue`,
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }),
    [entityID]
  );

  return (
    <CarbonLayer>
      <EventsDatagrid
        events={rawAssociatedEvents as RawEvent[]}
        loading={rawAssociatedEventsLoading}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
      />
    </CarbonLayer>
  );
};

export default RootCauseAssociatedEvents;
