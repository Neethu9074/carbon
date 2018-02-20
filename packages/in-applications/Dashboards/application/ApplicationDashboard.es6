import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import applicationBreadcrumbs from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connectTo({ timeframe: timeframe$ }, function ApplicationDashboard({ location, timeframe }) {
  const props = {
    applicationId: getMatrixParameter(location, applicationDashboard, applicationId),
    serviceId: getMatrixParameter(location, applicationDashboard, serviceId),
    endpointId: getMatrixParameter(location, applicationDashboard, endpointId),
    viewPath: applicationDashboard,
    timeframe
  };

  return (
    <Fragment>
      <Breadcrumbs items={applicationBreadcrumbs(props)} />
      <TabView
        result$={getApplication({
          id: props.applicationId,
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            endpoint: props.endpointId,
            timeframe
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

function Header({ result }) {
  return (
    <BasicApplicationDashboardHeader type="Application" result={result}>
      <Link href={'#'}>
        Configuration <SvgIcon type="gear" width={16} height={16} color="#06b7ba" />
      </Link>
    </BasicApplicationDashboardHeader>
  );
}
