import React, { Fragment } from 'react';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { configureSyntheticEndpointsView, configureEndpointsView } from 'in-applications/navigation/paths';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import HistoricAndLargeDataIndicator from 'in-applications/components/HistoricAndLargeDataIndicator';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { EndpointBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeTracesButton from 'in-applications/components/AnalyzeTracesButton';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { timeConfig$ } from 'in-stores/time/config';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './EndpointDashboard.mless';

export default connectTo({ timeConfig: timeConfig$ }, function EndpointDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    viewPath: endpointDashboard,
    timeConfig
  };

  const filterTabByResult = result =>
    get(result, ['data', 'synthetic'], false) ? tab => tab.label === 'Summary' : () => true;

  return (
    <Fragment>
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
    </Fragment>
  );
});

function Header(props) {
  const isSynthetic = get(props.result, ['data', 'synthetic'], false);
  const label = get(props.result, ['data', 'label']);
  const type = get(props.result, ['data', 'type']);
  const isUnspecified = label === 'Unspecified';
  const isTooMayEndpoints = label === 'Others';
  const isHttpEndpoint = type === 'HTTP';

  return (
    <Fragment>
      {isSynthetic && (
        <MessageBar
          title="Synthetic Endpoint"
          message="Calls to synthetic endpoints do not contribute to service or application KPIs."
          link={
            <Link
              className={locals.link}
              href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}
            >
              Configure Synthetic Endpoints
            </Link>
          }
        />
      )}
      {isUnspecified && (
        <MessageBar
          title="Unspecified Endpoint"
          message="This endpoint groups all calls which could not be mapped to a meaningful endpoint name."
        />
      )}
      {isTooMayEndpoints && (
        <MessageBar
          title="Too many endpoints"
          message={
            'Too many endpoints are detected on this service. To keep the number of endpoints at a reasonable level, calls are grouped under this endpoint. ' +
            (isHttpEndpoint
              ? role.canConfigureServiceMapping
                ? 'Modify the endpoint extraction rules to extract fewer but more meaningful endpoint names.'
                : 'Contact the administrator to modify the endpoint extraction rules to extract fewer but more meaningful endpoint names.'
              : '')
          }
          link={
            isHttpEndpoint &&
            role.canConfigureServiceMapping && (
              <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = configureEndpointsView))}>
                Configure Endpoint Extraction
              </Link>
            )
          }
        />
      )}
      <BasicDashboardHeader
        title="Endpoint"
        icon="lib_application_endpoint"
        renderActions={Actions}
        renderSubTypes={SubTypes}
        isSynthetic={isSynthetic}
        {...props}
      />
    </Fragment>
  );
}

function MessageBar({ title, message, link }) {
  return (
    <div className={locals.messageWrapper}>
      <Message>
        <span>
          <strong>{title} </strong>
          {message}
        </span>
        {link}
      </Message>
    </div>
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, result, isSynthetic }) {
  return (
    <Fragment>
      <AnalyzeTracesButton
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
      <HistoricAndLargeDataIndicator />
    </Fragment>
  );
}
