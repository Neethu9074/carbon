import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export function ServiceLink({ serviceId, node, isOutofAppContext, className, children }) {
  const link = (
    <EntityLink className={className} getLink={() => getLinkToService(serviceId, node.applicationId)}>
      {children}
    </EntityLink>
  );
  return isOutofAppContext ? <Tooltip content="The service is not in the current application.">{link}</Tooltip> : link;
}

export function EndpointLink({ serviceId, endpointId, applicationId, className, children }) {
  return (
    <EntityLink className={className} getLink={() => getLinkToEndpoint(serviceId, endpointId, applicationId)}>
      {children}
    </EntityLink>
  );
}

function EntityLink({ className, getLink, children }) {
  return (
    <div className={`${locals.entityLinkWrapper} ${className}`}>
      <Link className={`${locals.entityLink}`} href$={getLink()}>
        {children}
      </Link>
    </div>
  );
}

function getLinkToService(serviceId, applicationId) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getServiceDashboard(serviceId, { applicationId });
}

function getLinkToEndpoint(serviceId, endpointId, applicationId) {
  if (isUnspecified(serviceId) || isUnspecified(endpointId)) {
    return null;
  }
  return getEndpointDashboard(endpointId, { serviceId, applicationId });
}

function isUnspecified(id) {
  return id === 'Unspecified';
}
