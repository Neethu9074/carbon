import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { ApplicationBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';
import { compose } from 'recompose';

export default compose(
  withUrlState({
    bind: [
      applicationDashboardUrlParameters.applicationId,
      applicationDashboardUrlParameters.serviceId,
      applicationDashboardUrlParameters.endpointId,
      applicationDashboardUrlParameters.boundaryScope
    ],
    reducerName: 'onBoundaryStateChange'
  }),
  connectTo({
    timeConfig: timeConfig$
  })
)(ApplicationDashboard);
function ApplicationDashboard({
  onBoundaryStateChange,
  appId,
  boundaryScope: urlBoundaryScope,
  serviceId,
  endpointId,
  location,
  timeConfig
}) {
  const props = {
    applicationId: appId,
    serviceId,
    endpointId,
    viewPath: applicationDashboard,
    onBoundaryStateChange,
    timeConfig,
    urlBoundaryScope
  };

  return (
    <>
      <Breadcrumbs items={ApplicationBreadcrumbs(props)} />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        result$={getApplication({ id: appId })}
      />
      <Footer />
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_application"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
    />
  );
}

function renderButtonLine({ applicationId, serviceId, endpointId, timeConfig, boundaryScope }) {
  return (
    <>
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
      />
      <ApplicationEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
      />
    </>
  );
}
