import React from 'react';

import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function EndpointSelectBox({ applicationId, serviceId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();
  const endpoints =
    useObservable(getEndpointsObservable, [applicationId, serviceId, boundaryScope, timeConfig]) ?? pendingResult;

  const { data } = endpoints;
  const endpointItems = data?.items?.map(({ endpoint }) => ({ value: endpoint.id, label: endpoint.label }));

  if (isLoading(endpoints)) {
    return <FormDropDown options={[{ value: '', label: '<loading>' }]} disabled />;
  }

  return (
    <>
      {
        <FormDropDown
          disabled={hasError(endpoints)}
          options={[{ value: '', label: 'All Endpoints' }, ...(endpointItems ?? [])]}
          value={value ?? ''}
          onChange={({ target }) => onChange?.(target?.value)}
        />
      }
    </>
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
