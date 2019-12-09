import React, { Fragment } from 'react';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { ApplicationBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
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
  connectTo(({ appId }) => ({
    timeConfig: timeConfig$,
    result: getApplication({ id: appId })
  }))
)(ApplicationDashboard);
function ApplicationDashboard({
  onBoundaryStateChange,
  appId,
  boundaryScope: urlBoundaryScope,
  serviceId,
  endpointId,
  location,
  timeConfig,
  result
}) {
  const isLoading = get(result, ['progress', 'loading']);

  if (isLoading) {
    return <LoadingCallDetails progress={result.progress} />;
  }

  const hasErrors = get(result, ['errors', 'length'], 0) > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  const application = result.data;
  const props = {
    applicationId: appId,
    result,
    serviceId,
    endpointId,
    viewPath: applicationDashboard,
    onBoundaryStateChange,
    timeConfig,
    defaultBoundaryScope: application.boundaryScope,
    boundaryScope: urlBoundaryScope || application.boundaryScope,
    data: application,
    application: application
  };
  return (
    <Fragment>
      <Breadcrumbs items={ApplicationBreadcrumbs(props)} />
      <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} />
      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Application" icon="lib_application" renderActions={Actions} {...props} />;
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, boundaryScope }) {
  return (
    <Fragment>
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
    </Fragment>
  );
}
