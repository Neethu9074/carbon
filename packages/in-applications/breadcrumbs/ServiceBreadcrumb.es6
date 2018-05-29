import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getServiceLabel({
      id: props.serviceId
    })
  }),
  function ServiceBreadcrumb({ service, serviceId, applicationId }) {
    return (
      <Breadcrumb
        href$={getServiceDashboard(serviceId, { applicationId })}
        label="Service"
        icon="lib_application_service"
      >
        {service.data && service.data.label}
      </Breadcrumb>
    );
  }
);
