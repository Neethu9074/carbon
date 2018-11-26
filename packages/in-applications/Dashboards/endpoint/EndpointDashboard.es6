import React, { Fragment } from 'react';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { EndpointBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import { configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import CallsButton from 'in-applications/components/CallsButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { timeConfig$ } from 'in-stores/time/config';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './EndpointDashboard.mless';

export default connectTo({ timeConfig: timeConfig$ }, function EndpointDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    viewPath: endpointDashboard,
    timeConfig
  };
  return (
    <Fragment>
      <Breadcrumbs items={EndpointBreadcrumbs(props)} />
      <TabView
        result$={getEndpoint({
          id: props.endpointId,
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            endpoint: props.endpointId,
            timeConfig
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

function Header(props) {
  const isSynthetic = get(props.result, ['data', 'synthetic'], false);
  return (
    <Fragment>
      {isSynthetic && (
        <Message className={locals.message}>
          <span>
            <strong>Synthetic Endpoint </strong>
            Calls to this endpoint do not contribute to your application, or service, KPIs within Instana.
          </span>
          <Link
            className={locals.link}
            href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}
          >
            View Ignored Rules
          </Link>
        </Message>
      )}
      <BasicDashboardHeader
        title="Endpoint"
        icon="lib_application_endpoint"
        renderActions={Actions}
        renderSubTypes={SubTypes}
        {...props}
      />
    </Fragment>
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, result }) {
  const isSynthetic = get(result, ['data', 'synthetic'], false);
  return (
    <Fragment>
      <CallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        isSynthetic={isSynthetic}
        timeConfig={timeConfig}
      />
      <ApplicationEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        resolvedEndpointId={get(result, ['data', 'id'])}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <EndpointTypeBadgeList types={[result.data.type]} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </Fragment>
  );
}
