/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getEndpointIds,
  getServiceIds,
  transformHiddenTags
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper';
import { withTimeout } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/withTimeout';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { error, isLoading, noResultObservable } from 'in-services/util/result';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import getService from 'in-applications/subscriptions/getService';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';

const pendingResults = [pendingResult];

export default function AnalyzeHiddenTagsViewParameterConversion({ onConversionCompleted }) {
  const { location, createHref } = useNavigation();
  const timeConfig = useTimeConfig();
  const endpointIds = useMemo(() => getEndpointIds(location), [location]);
  const serviceIds = useMemo(() => getServiceIds(location), [location]);

  const endpointResults = useObservable(getEndpointObservables, [endpointIds, timeConfig]) ?? pendingResults;
  const serviceResults = useObservable(getServiceObservables, [serviceIds, timeConfig]) ?? pendingResults;
  // endpointResults may include additional serviceIds which we have to resolve
  const serviceForEndpointResults =
    useObservable(getServiceForEndpointObservables, [serviceIds, endpointResults, timeConfig]) ?? pendingResults;

  useEffect(() => {
    if (isReadyToConvert(endpointResults, serviceResults, serviceForEndpointResults)) {
      onConversionCompleted(true);
    }
  }, [serviceResults, endpointResults, serviceForEndpointResults, onConversionCompleted]);

  let redirectHref;
  if (isReadyToConvert(endpointResults, serviceResults, serviceForEndpointResults)) {
    const redirectLocation = { ...location };
    transformHiddenTags({
      location: redirectLocation,
      serviceResults: [...serviceResults, ...serviceForEndpointResults],
      endpointResults
    });
    redirectHref = createHref(redirectLocation);
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}

function isReadyToConvert(endpointResults, serviceResults, serviceForEndpointResults) {
  return (
    isLoadingCompleted(endpointResults) &&
    isLoadingCompleted(serviceResults) &&
    isLoadingCompleted(serviceForEndpointResults)
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
