import React from 'react';

import BasicApplicationDashboardWrapper from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardWrapper';
import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';

import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import getApplication from 'in-subscription/application/getApplication';
import breadcrumbs from 'in-applications/Dashboards/application/breadcrumbs';

export default function ApplicationDashboard({ location }) {
  return (
    <BasicApplicationDashboardWrapper
      get={({ timeframe, applicationId }) =>
        getApplication({
          id: applicationId,
          filter: {
            applicationName: applicationId,
            timeframe
          }
        })
      }
      HeaderComponent={Header}
      location={location}
      dashboardBasedUrl={applicationDashboard}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
    />
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader type="application" result={result} />;
}
