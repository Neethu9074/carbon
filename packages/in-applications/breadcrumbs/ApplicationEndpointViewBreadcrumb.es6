import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import getEndpoint from 'in-subscription/application/getEndpoint';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    endpoint: getEndpoint({
      id: props.endpointId,
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationEndpointViewBreadcrumb({ endpoint, endpointId, applicationId, serviceId }) {
    if (endpoint.progress.loading || endpoint.errors.length > 0) {
      return <Breadcrumb href$={getEndpointDashboard(endpointId, { applicationId, serviceId })}>Endpoint</Breadcrumb>;
    } else {
      return (
        <Breadcrumb href$={getEndpointDashboard(endpointId, { applicationId, serviceId })}>
          Endpoint ({endpoint.data.label})
        </Breadcrumb>
      );
    }
  }
);
