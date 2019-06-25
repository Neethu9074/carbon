import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getServiceLabel({
      id: props.serviceId
    })
  }),
  function ServiceBreadcrumb({ service, serviceId, applicationId }) {
    return (
      <WithApplicationHealthIndicationBehaviour
        applicationId={applicationId}
        serviceId={serviceId}
        render={healthInfo => (
          <Breadcrumb
            href$={getServiceDashboard(serviceId, { applicationId })}
            label="Service"
            icon="lib_application_service"
            healthInfo={healthInfo}
          >
            {service.data && service.data.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
