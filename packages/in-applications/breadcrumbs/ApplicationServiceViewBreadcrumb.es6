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
        service: props.serviceId,
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationServiceViewBreadcrumb({ service, serviceId, applicationId }) {
    return (
      <Breadcrumb href$={getServiceDashboard(serviceId, { applicationId })} label="Service">
        {service.data && service.data.label}
      </Breadcrumb>
    );
  }
);
