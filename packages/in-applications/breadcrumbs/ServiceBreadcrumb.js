import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getServiceLabel({
      id: props.serviceId
    })
  }),
  function ServiceBreadcrumb({ service, serviceId, applicationId, boundaryScope }) {
    return (
      <WithApplicationHealthIndicationBehaviour
        applicationId={applicationId}
        serviceId={serviceId}
        render={healthInfo => (
          <Breadcrumb
            href$={getServiceDashboard(serviceId, { applicationId, boundaryScope })}
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
