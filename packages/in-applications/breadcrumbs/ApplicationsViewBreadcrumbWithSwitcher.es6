import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplications from 'in-subscription/application/getApplications';
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
    }),
    applications: getApplications({
      pagination: {
        page: 1,
        pageSize: 100
      },
      order: {
        by: 'label',
        direction: 'ASC'
      },
      metrics: {},
      filter: {
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationListViewBreadcrumb({ application, applications, applicationId }) {
    if (
      application.progress.loading ||
      application.errors.length > 0 ||
      (applications.progress.loading || applications.errors.length > 0)
    ) {
      return <Breadcrumb href$={getApplicationDashboard(applicationId)}>Applications</Breadcrumb>;
    } else {
      return (
        <Breadcrumb href$={getApplicationDashboard(applicationId)}>
          <div className={locals.breadcrumb}>
            <div className={locals.label}>{`Applications (${applications.data.items.length})`} </div>
            <div className={locals.entityLabel}>{application.data.label}</div>
          </div>
        </Breadcrumb>
      );
    }
  }
);
