/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { EntityHealthInfo, Result, TimeConfig, Event } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import { eventsPath } from 'in-events/navigation/paths';

interface BizOpsOpenIssuesListProps {
  inContentArea: boolean;
  serviceIds: string[];
  close: any;
  timeConfig: TimeConfig;
}

// Overlay content containing open issues from a resource with multiple serviceIDs
export default function BizOpsOpenIssuesList({
  inContentArea,
  serviceIds,
  close,
  timeConfig
}: BizOpsOpenIssuesListProps) {
  const additionalDFQFilter = getAdditionalFilters({ serviceIds });
  const eventsViewFilteredByOrQuery = getEventsViewFilteredByOrQuery(serviceIds);

  interface maxWidthContentProps {
    children: React.ReactNode;
    maxWidth: string;
  }
  // A simple solution to avoid some parts of the popup area hidden when too wide.
  function WithMaxWidthWhenInContentArea({ children, maxWidth }: maxWidthContentProps) {
    if (inContentArea) return <div style={{ maxWidth }}>{children}</div>;
    return <>{children}</>;
  }

  // Grab the open issues data from each of the serviceIds passed into this component.
  // The result must be aggregated so that the overlay displays all issues from each service ID.
  let openIssuesResult = {
    progress: {
      loading: true
    },
    errors: [],
    data: []
  };

  // align the time config to now if it does not exist
  let alignedTimeConfig = { ...timeConfig, ...{ to: Date.now(), focusedMoment: Date.now() } };

  let openResults: Result<EntityHealthInfo>[] = [];
  serviceIds.forEach(serviceId => {
    // This observable is called from within a loop, which triggers an automatic rules-of-hooks warning.
    // Since these serviceIds will always be in the same order when rendered in this component, this is fine.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const currentHealthResult = useObservable(
      getApplicationEntityHealthInfo({
        applicationId: '',
        serviceId,
        endpointId: '',
        timeConfig: timeConfig.to ? timeConfig : alignedTimeConfig
      }),
      [timeConfig]
    ) ?? pendingResult;
    if (currentHealthResult) openResults.push(currentHealthResult);
  });

  // Aggregate the results from each serviceID, these need to be in the same object to be passed into OpenIssuesListPresenter
  let fullData: Event[] = [];
  openResults.forEach(result => {
    if (result.data?.openIssues) {
      // concat arrays without duplicates
      fullData = [...new Set([...fullData, ...result.data.openIssues])];
    }
  });

  // @ts-expect-error OpenIssuesListPresenter expects a map which is different from EntityHealthInfo
  openIssuesResult.data = fullData;

  // if the full data is ready to load, the component is no longer loading
  if (openIssuesResult.data?.[0]) openIssuesResult.progress.loading = false;

  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();

  return (
    <WithMaxWidthWhenInContentArea maxWidth="80vw">
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        analyzeLink={useLinkToEventsViewFilteredByOr(eventsViewFilteredByOrQuery)}
        getIssueLink={(eventId: string) => {
          // get the service ID that corresponds to this event
          let serviceId = '';
          openIssuesResult.data.forEach((result: Event) => {
            if (eventId === result.id) {
              serviceId = result.entityId;
            }
          });
          return getEventsViewFilteredBy({
            applicationId: '',
            serviceId: serviceId,
            endpointId: '',
            resolvedEndpointId: '',
            eventId,
            eventTypeFilter: 'issue',
            additionalDFQFilter
          });
        }}
      />
    </WithMaxWidthWhenInContentArea>
  );
}

function getEventsViewFilteredByOrQuery(serviceIds: string[]) {
  let query = '';

  if (serviceIds) {
    query += '(';
    serviceIds.forEach((id, index) => {
      query += `entity.service.id:"${id}"`;
      if (index < serviceIds.length - 1) {
        query += ' OR ';
      }
    });
    query.trim();
    query += ') entity.selfType:service';
  }

  return query;
}

function useLinkToEventsViewFilteredByOr(query: string) {
  const { createHref, location } = useNavigation();

  location.pathname = eventsPath;
  if (query) {
    location.query.q = query;
  }

  setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue');

  return createHref(location);
}

interface BizOpsAdditionalFiltersProps {
  serviceIds: string[];
}

function getAdditionalFilters({ serviceIds }: BizOpsAdditionalFiltersProps) {
  const dfq = '';

  if (serviceIds) {
    return `entity.selfType:service ${dfq}`;
  }

  return dfq;
}
