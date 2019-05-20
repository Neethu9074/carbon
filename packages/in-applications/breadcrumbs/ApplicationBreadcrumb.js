import React from 'react';

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
      <Breadcrumb href$={getApplicationDashboard(applicationId)} label="Application" icon="lib_application">
        {application.data && application.data.label}
      </Breadcrumb>
    );
  }
);
