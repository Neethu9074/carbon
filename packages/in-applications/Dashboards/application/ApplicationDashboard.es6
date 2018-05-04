import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { ApplicationBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TracesButton from 'in-applications/components/TracesButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-new-components/TabView/TabView';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function ApplicationDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, applicationDashboard, applicationId),
    serviceId: getMatrixParameter(location, applicationDashboard, serviceId),
    endpointId: getMatrixParameter(location, applicationDashboard, endpointId),
    viewPath: applicationDashboard,
    timeConfig
  };

  return (
    <Fragment>
      <Breadcrumbs items={ApplicationBreadcrumbs(props)} />
      <TabView
        result$={getApplication({
          id: props.applicationId
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

function Header(props) {
  return <BasicApplicationDashboardHeader type="Application" renderActions={Actions} {...props} />;
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, result }) {
  return (
    <TracesButton
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      backButtonLabels={{
        label1: 'Application',
        label2: result.data ? result.data.label : 'Dashboard'
      }}
    />
  );
}
