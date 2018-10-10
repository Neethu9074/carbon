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
        service: props.serviceId,
        endpoint: props.endpointId,
        timeConfig: props.timeConfig
      }
    })
  }),
  function EndpointBreadcrumb({ endpoint, endpointId, applicationId, serviceId }) {
    if (!endpoint.data) {
      return null;
    }

    return (
      <Breadcrumb
        href$={getEndpointDashboard(endpoint.data.label, { applicationId, serviceId, endpointId })}
        label="Endpoint"
      >
        {endpoint.data.label}
      </Breadcrumb>
    );
  }
);
