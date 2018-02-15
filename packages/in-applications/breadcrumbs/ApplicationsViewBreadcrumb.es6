import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplication from 'in-subscription/application/getApplication';
import connectTo from 'in-hoc/connectTo';

import locals from './Breadcrumps.mless';

export default connectTo(
  props => ({
    application: getApplication({
      id: props.applicationId,
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationListViewBreadcrumb({ application, applicationId }) {
    if (application.progress.loading || application.errors.length > 0) {
      return <Breadcrumb href$={getApplicationDashboard(applicationId)}>Applications</Breadcrumb>;
    } else {
      return (
        <Breadcrumb href$={getApplicationDashboard(applicationId)}>
          <div className={locals.breadcrumb}>
            <div className={locals.label}>Applications</div>
            <div className={locals.entityLabel}>{application.data.label}</div>
          </div>
        </Breadcrumb>
      );
    }
  }
);
