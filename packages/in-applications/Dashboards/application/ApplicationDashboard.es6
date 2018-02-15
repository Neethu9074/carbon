import React from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ApplicationDashboard.mless';

export default connectTo({ timeframe: timeframe$ }, function ApplicationDashboard({ location, timeframe }) {
  const application = getMatrixParameter(location, applicationDashboard, applicationId);
  const service = getMatrixParameter(location, applicationDashboard, serviceId);
  const endpoint = getMatrixParameter(location, applicationDashboard, endpointId);

  return (
    <TabView
      result$={getData(location, application, service, endpoint)}
      HeaderComponent={Header}
      location={location}
      tabs={tabs}
      props={{ timeframe, applicationId: application, serviceId: service, endpointId: endpoint }}
    />
  );
});

function getData(location, application, service, endpoint) {
  return timeframe$.flatMap(timeframe =>
    getApplication({
      id: getMatrixParameter(location, applicationDashboard, applicationId),
      filter: {
        application,
        service,
        endpoint,
        timeframe
      }
    })
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
