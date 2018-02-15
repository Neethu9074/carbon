import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { endpointDashboard } from 'in-applications/navigation/paths';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { getView } from 'in-stores/navigation';
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
  function ApplicationEndpointViewBreadcrumb({ endpoint }) {
    if (endpoint.progress.loading || endpoint.errors.length > 0) {
      return <Breadcrumb href$={getView(endpointDashboard)}>Endpoint</Breadcrumb>;
    } else {
      return <Breadcrumb href$={getView(endpointDashboard)}>Endpoint ({endpoint.data.label})</Breadcrumb>;
    }
  }
);
