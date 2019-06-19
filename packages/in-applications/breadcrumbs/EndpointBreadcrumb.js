import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import getEndpoint from 'in-subscription/application/getEndpoint';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    endpoint: getEndpoint({
      id: props.endpointId,
      filter: {
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
      <WithApplicationHealthIndicationBehaviour
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        render={healthInfo => (
          <Breadcrumb
            href$={getEndpointDashboard(endpoint.data.id, { applicationId, serviceId, endpointId })}
            label="Endpoint"
            icon="lib_application_endpoint"
            healthInfo={healthInfo}
          >
            {endpoint.data.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
