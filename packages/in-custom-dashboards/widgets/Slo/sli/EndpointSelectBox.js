import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function EndpointSelectBox({ applicationId, field, serviceId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(getEndpointsObservable, [applicationId, serviceId, boundaryScope, timeConfig]) ?? pendingResult;

  return (
    <SelectInSection
      id="new-sli-endpoint-selection"
      label="Endpoint"
      disabled={hasError(result) || isLoading(result)}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={!field.valid && field.touched}
    >
      {isLoading(result) ? <option value="">{'<loading>'}</option> : <option value="">All Services</option>}
      {result.data?.items?.map(({ endpoint }) => (
        <option value={endpoint.id} key={endpoint.id}>
          {endpoint.label}
        </option>
      ))}
    </SelectInSection>
  );
}

function getEndpointsObservable([applicationId, serviceId, boundaryScope, timeConfig]) {
  return getEndpoints({
    pagination: {
      page: 1,
      pageSize: 100
    },
    order: {
      by: 'endpointLabel',
      direction: 'ASC'
    },
    metrics: {
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      service: serviceId,
      application: applicationId,
      applicationBoundaryScope: boundaryScope,
      timeConfig
    },
    contextScope: 'NONE'
  });
}
