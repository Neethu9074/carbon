/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { EntityHealthInfo, Result, TimeConfig, Event } from '@instana/types';
import { combineLatest, Observable } from '@instana/observables';
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
  serviceIds?: string[];
  endpointIds?: string[];
  close: any;
  timeConfig: TimeConfig;
}

// Overlay content containing open issues from a resource with multiple serviceIDs
export default function BizOpsOpenIssuesList({
  inContentArea,
  serviceIds,
  endpointIds,
  close,
  timeConfig
}: BizOpsOpenIssuesListProps) {
  const hasServiceId = Boolean(serviceIds?.length);
  const hasEndpointId = Boolean(endpointIds?.length);

  const additionalDFQFilter = getAdditionalFilters({ hasServiceId, hasEndpointId });
  const eventsViewFilteredByOrQuery = getEventsViewFilteredByOrQuery({ serviceIds, endpointIds });

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

  let observableList$: Observable<Result<EntityHealthInfo>>[] = [];

  serviceIds?.forEach(serviceId => {
    observableList$.push(
      getApplicationEntityHealthInfo({
        applicationId: '',
        serviceId,
        endpointId: '',
        timeConfig: timeConfig.to ? timeConfig : alignedTimeConfig
      })
    );
  });

  endpointIds?.forEach(endpointId => {
    observableList$.push(
      getApplicationEntityHealthInfo({
        applicationId: '',
        serviceId: '',
        endpointId,
        timeConfig: timeConfig.to ? timeConfig : alignedTimeConfig
      })
    );
  });

  const openResults: Result<EntityHealthInfo>[] = useObservable(combineLatest(observableList$), [
    timeConfig,
    serviceIds,
    endpointIds
  ]) ?? [pendingResult];

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

interface GetEventsViewProps {
  serviceIds?: string[];
  endpointIds?: string[];
}

function getEventsViewFilteredByOrQuery({ serviceIds, endpointIds }: GetEventsViewProps) {
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

  if (endpointIds) {
    query += '(';
    endpointIds.forEach((id, index) => {
      query += `entity.endpoint.id:"${id}"`;
      if (index < endpointIds.length - 1) {
        query += ' OR ';
      }
    });
    query.trim();
    query += ') entity.selfType:endpoint';
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

interface GetAdditionalFiltersProps {
  hasServiceId: boolean;
  hasEndpointId: boolean;
}

function getAdditionalFilters({ hasServiceId, hasEndpointId }: GetAdditionalFiltersProps) {
  // There is a bug currently which lead to all events are hidden in the event view.
  // A user wouldn't be able then to investigate further because there is no event to click on.
  // Till that is solved, we disable this filter.
  // const dfq = `event.state:open`;
  const dfq = '';

  if (hasEndpointId) {
    return `entity.selfType:endpoint ${dfq}`;
  }

  if (hasServiceId) {
    return `entity.selfType:service ${dfq}`;
  }

  return dfq;
}
