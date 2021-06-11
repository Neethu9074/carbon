/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { isEmpty } from 'lodash';

import { combineLatest, timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getEndpointIds,
  getServiceIds,
  transformHiddenTags
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { error, isLoading, noResultObservable } from 'in-services/util/result';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { getModifiedUrl } from 'in-stores/navigation/navigation';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import getService from 'in-subscription/application/getService';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';

const pendingResults = [pendingResult];

export default function AnalyzeHiddenTagsViewParameterConversion({ onConversionCompleted, isLoading }) {
  const location = useLocation();
  const timeConfig = useTimeConfig();
  const endpointIds = useMemo(() => getEndpointIds(location), [location]);
  const serviceIds = useMemo(() => getServiceIds(location), [location]);

  const endpointResults = useObservable(getEndpointObservables, [endpointIds, timeConfig]) ?? pendingResults;
  const serviceResults = useObservable(getServiceObservables, [serviceIds, timeConfig]) ?? pendingResults;
  // endpointResults may include additional serviceIds which we have to resolve
  const serviceForEndpointResults =
    useObservable(getServiceForEndpointObservables, [serviceIds, endpointResults, timeConfig]) ?? pendingResults;

  useEffect(() => {
    if (
      isLoadingCompleted(endpointResults) &&
      isLoadingCompleted(serviceResults) &&
      isLoadingCompleted(serviceForEndpointResults)
    ) {
      const resolvedServiceIds = serviceResults.map(res => res.data?.id).filter(Boolean);
      const resolvedEndpointIds = endpointResults.map(res => res.data?.id).filter(Boolean);

      const unresolvedServiceIds = serviceIds.filter(id => !resolvedServiceIds.includes(id));
      const unresolvedEndpointIds = endpointIds.filter(id => !resolvedEndpointIds.includes(id));

      onConversionCompleted({ unresolvedServiceIds, unresolvedEndpointIds });
    }
  }, [endpointIds, serviceIds, serviceResults, endpointResults, serviceForEndpointResults, onConversionCompleted]);

  let redirectHref;
  if (
    !isLoading &&
    isLoadingCompleted(endpointResults) &&
    isLoadingCompleted(serviceResults) &&
    isLoadingCompleted(serviceForEndpointResults)
  ) {
    redirectHref = getModifiedUrl(location, location =>
      transformHiddenTags({
        location,
        serviceResults: [...serviceResults, ...serviceForEndpointResults],
        endpointResults
      })
    );
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}

function isLoadingCompleted(result) {
  return !result.some(r => isLoading(r));
}

function getEndpointObservables([endpointIds, timeConfig]) {
  return getObservables(endpointIds, timeConfig, getEndpoint);
}

function getServiceObservables([serviceIds, timeConfig]) {
  return getObservables(serviceIds, timeConfig, getService);
}

function getServiceForEndpointObservables([serviceIds, endpointResults, timeConfig]) {
  if (!isLoadingCompleted(endpointResults)) {
    return null;
  }
  const serviceIdsForEndpoints = endpointResults.map(res => res.data?.serviceId).filter(Boolean);
  const additionalServicesIds = [...new Set(serviceIdsForEndpoints.filter(id => !serviceIds.includes(id)))];
  return getObservables(additionalServicesIds, timeConfig, getService);
}

function getObservables(ids, timeConfig, getData) {
  let observables;
  if (isEmpty(ids)) {
    observables = [noResultObservable()];
  } else {
    observables = ids.map(id =>
      withTimeout(
        getData({
          id: id,
          filter: {
            timeConfig
          }
        }),
        3000,
        () => error(['Timeout'])
      )
    );
  }
  return combineLatest(observables);
}

// exported for tests
export function withTimeout(observable, millis, onTimeout) {
  const timeoutSignal = 'signal';

  return combineLatest([
    observable.startWith(pendingResult),
    timeout(millis)
      .map(() => timeoutSignal)
      .startWith(null)
  ])
    .map(([observable, signal]) =>
      observable === pendingResult && signal === timeoutSignal ? onTimeout() : observable
    )
    .distinct();
}
