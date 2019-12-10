import { get } from 'lodash';
import React from 'react';

import InboundOrAllCallsNotification from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsNotification';
import { configureSyntheticEndpointsView, configureEndpointsView } from 'in-applications/navigation/paths';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { switchScope } from 'in-applications/constants';
import Message from 'in-new-components/Message';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './EndpointDashboardNotifications.mless';

export default function EndpointDashboardNotifications({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  currentTab,
  result
}) {
  if (!applicationId) {
    return null;
  }

  const isSynthetic = get(result, ['data', 'synthetic'], false);
  const label = get(result, ['data', 'label']);
  const type = get(result, ['data', 'type']);
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
    </div>
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
