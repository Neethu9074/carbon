import React, { Fragment } from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { ApplicationBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { boundaryScopes } from 'in-applications/constants';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';
import { compose } from 'recompose';

export default compose(
  connectTo({ timeConfig: timeConfig$ }),
  withUrlState({
    bind: [
      applicationDashboardUrlParameters.applicationId,
      applicationDashboardUrlParameters.serviceId,
      applicationDashboardUrlParameters.endpointId,
      applicationDashboardUrlParameters.boundaryScope
    ],
    reducerName: 'onBoundaryStateChange'
  })
)(ApplicationDashboard);
function ApplicationDashboard({
  onBoundaryStateChange,
  appId,
  boundaryScope,
  serviceId,
  endpointId,
  location,
  timeConfig
}) {
  const props = {
    applicationId: appId,
    serviceId,
    endpointId,
    boundaryScope,
    viewPath: applicationDashboard,
    onBoundaryStateChange,
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

      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Application" icon="lib_application" renderActions={Actions} {...props} />;
}

function filterByBoundaryScope(boundaryScope) {
  return (
    (boundaryScopes.inbound === boundaryScope && [
      {
        name: 'application.name',
        operator: operators.NOT_EQUAL,
        entity: entityTypes.SOURCE
      }
    ]) ||
    []
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, boundaryScope }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        filters={filterByBoundaryScope(boundaryScope)}
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
