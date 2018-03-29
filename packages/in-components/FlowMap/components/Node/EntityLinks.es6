import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export function ServiceLink({ serviceId, className, children }) {
  return (
    <EntityLink className={className} getLink={() => getLinkToService(serviceId)}>
      {children}
    </EntityLink>
  );
}

export function EndpointLink({ serviceId, endpointId, className, children }) {
  return (
    <EntityLink className={className} getLink={() => getLinkToEndpoint(serviceId, endpointId)}>
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

function getLinkToService(serviceId) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getServiceDashboard(serviceId);
}

function getLinkToEndpoint(serviceId, endpointId) {
  if (isUnspecified(serviceId) || isUnspecified(endpointId)) {
    return null;
  }
  return getEndpointDashboard(endpointId, { serviceId });
}

function isUnspecified(id) {
  return id === 'Unspecified';
}
