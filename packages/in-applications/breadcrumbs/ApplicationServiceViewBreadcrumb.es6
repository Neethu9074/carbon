import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import getService from 'in-subscription/application/getService';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getService({
      id: props.serviceId,
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationServiceViewBreadcrumb({ service, serviceId, applicationId, endpointId }) {
    if (service.progress.loading || service.errors.length > 0) {
      return <Breadcrumb href$={getServiceDashboard(serviceId, { applicationId, endpointId })}>Services</Breadcrumb>;
    } else {
      return (
        <Breadcrumb href$={getServiceDashboard(serviceId, { applicationId, endpointId })}>
          Services ({service.data.label})
        </Breadcrumb>
      );
    }
  }
);
