import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { EndpointBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function EndpointDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    boundaryScope: getMatrixParameter(location, endpointDashboard, boundaryScope),
    viewPath: endpointDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    timeConfig
  };

  const filterTabByResult = result =>
    get(result, ['data', 'synthetic'], false) ? tab => tab.label === 'Summary' : () => true;

  return (
    <>
      <Breadcrumbs items={EndpointBreadcrumbs(props)} />
      <TabView
        result$={getEndpoint({
          id: props.endpointId,
          filter: {
            application: props.applicationId,
            service: null,
            endpoint: props.endpointId,
            timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        filterTabByResult={filterTabByResult}
        props={props}
      />

      <Footer />
    </>
  );
});

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_application_endpoint"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ applicationId, serviceId, endpointId, boundaryScope, timeConfig, result, isSynthetic }) {
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        resolvedEndpointId={get(result, ['data', 'id'])}
        timeConfig={timeConfig}
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        isSynthetic={isSynthetic}
        timeConfig={timeConfig}
        groupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <EndpointTypeBadgeList types={[result.data.type]} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </>
  );
}
