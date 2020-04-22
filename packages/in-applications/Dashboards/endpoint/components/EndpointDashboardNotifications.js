import { get } from 'lodash';
import React from 'react';

import InboundOrAllCallsNotification from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsNotification';
import {
  configureEndpointsView,
  configureSyntheticEndpointsView,
  getEndpointDashboard
} from 'in-applications/navigation/paths';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getApplication from 'in-subscription/application/getApplication';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import locals from './EndpointDashboardNotifications.mless';
import { switchScope } from 'in-applications/constants';
import { emptyObject } from 'in-services/fixedObjects';
import Message from 'in-new-components/Message';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function EndpointDashboardNotifications({
  applicationId,
  applicationLabel,
  serviceId,
  serviceLabel,
  endpointId,
  endpointLabel,
  boundaryScope,
  currentTab,
  data
}) {
  const syntheticType = get(data, ['syntheticType'], 'NON_SYNTHETIC');
  const label = get(data, ['label']);
  const type = get(data, ['type']);
  const isUnspecified = label === 'Unspecified';
  const isTooMayEndpoints = label === 'Others';
  const isHttpEndpoint = type === 'HTTP';

  return (
    <div className={locals.wrapper}>
      {applicationId &&
        currentTab !== '/flowMap' && (
          <div className={locals.messageWrapper}>
            <InboundOrAllCallsNotification
              applicationId={applicationId}
              boundaryScope={boundaryScope}
              entityType="endpoint"
              switchTo={getEndpointDashboard(endpointId, {
                applicationId,
                serviceId,
                boundaryScope: switchScope(boundaryScope),
                tab: currentTab
              })}
            />
          </div>
        )}

      {syntheticType === 'SYNTHETIC' && (
        <MessageBar
          title="Synthetic Endpoint"
          message="Calls to synthetic endpoints do not contribute to service or application KPIs."
          link={<ConfigureSyntheticEndpoints />}
        />
      )}

      {syntheticType === 'MIXED' && (
        <MessageBar
          title="Endpoint also receiving synthetic calls"
          message={
            <SyntheticCallsLink
              textBefore="The "
              linkText="synthetic calls"
              textAfter=" do not contribute to the endpoint, service or application KPIs."
              applicationLabel={applicationLabel}
              serviceLabel={serviceLabel}
              endpointLabel={endpointLabel}
              boundaryScope={boundaryScope}
              data={data}
            />
          }
          link={<ConfigureSyntheticEndpoints />}
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
    </div>
  );
});

function ConfigureSyntheticEndpoints() {
  return (
    <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}>
      Configure Synthetic Endpoints
    </Link>
  );
}

function SyntheticCallsLink({
  textBefore,
  linkText,
  textAfter,
  applicationLabel,
  serviceLabel,
  endpointLabel,
  boundaryScope
}) {
  return (
    <span>
      {textBefore}
      <Link
        href$={getLinkToAnalyze({
          applicationName: applicationLabel,
          serviceName: serviceLabel,
          endpointName: endpointLabel,
          boundaryScope: boundaryScope,
          dataSource: 'calls',
          filters: [{ name: 'call.is_synthetic', value: 'true' }, { name: 'include_synthetic', value: 'true' }],
          groupByTag: emptyObject
        })}
      >
        {linkText}
      </Link>
      {textAfter}
    </span>
  );
}

function MessageBar({ title, message, link }) {
  return (
    <div className={locals.messageWrapper}>
      <Message small>
        <span>
          <strong>{title} </strong>
          {message}
        </span>
        {link}
      </Message>
    </div>
  );
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
