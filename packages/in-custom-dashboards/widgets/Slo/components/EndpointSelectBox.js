import React from 'react';

import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { noop } from 'in-services/util/function';

export default function EndpointSelectBox({ applicationId, serviceId }) {
  const timeConfig = useTimeConfig();
  const api = {
    getTagSuggestions: () => {
      return just({
        progress: { loading: false },
        data: {
          suggestions: ['Service 1', 'Service 2']
        }
      });
    }
  };

  const endpoints$ = getEndpoints({
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
      timeConfig
    },
    contextScope: 'NONE'
  });

  const endpointsResponse = useObservable(endpoints$, [applicationId, serviceId]) ?? pendingResult;
  const { progress, errors, data } = endpointsResponse;
  const endpointItems = data?.items?.map(({ endpoint }) => ({ value: endpoint.id, label: endpoint.label }));

  // TODO: improve error handling
  return (
    <>
      {!endpointItems && progress?.loading && !errors && (
        <DropDownMock options={[{ value: '', label: '<loading>' }]} disabled />
      )}
      {endpointItems && (
        <DropDownMock
          options={[
            { value: undefined, label: 'Please select' },
            { value: '', label: 'All Endpoints' },
            ...endpointItems
          ]}
          value={''}
          onChange={noop}
        />
      )}
    </>
  );
}
