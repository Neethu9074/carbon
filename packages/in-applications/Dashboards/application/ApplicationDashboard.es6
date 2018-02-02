import React from 'react';

import BasicApplicationDashboardWrapper from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardWrapper';
import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';

import breadcrumbs from 'in-applications/Dashboards/application/breadcrumbs';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ApplicationDashboard.mless';

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
  return (
    <BasicApplicationDashboardHeader type="application" result={result} className={locals.header}>
      <div>
        <Link href={'#'} className={locals.configuration}>
          Configuration <SvgIcon type="gear" width={16} height={16} color="#06b7ba" />
        </Link>
      </div>
    </BasicApplicationDashboardHeader>
  );
}
