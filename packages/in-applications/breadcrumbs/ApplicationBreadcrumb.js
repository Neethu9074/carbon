import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplication from 'in-subscription/application/getApplication';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    application: getApplication({
      id: props.applicationId
    })
  }),
  function ApplicationBreadcrumb({ application, applicationId }) {
    return (
      <WithApplicationHealthIndicationBehaviour
        applicationId={applicationId}
        render={healthInfo => (
          <Breadcrumb
            href$={getApplicationDashboard(applicationId)}
            label="Application"
            icon="lib_application"
            healthInfo={healthInfo}
          >
            {application.data && application.data.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
