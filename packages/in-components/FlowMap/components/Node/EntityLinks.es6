import React from 'react';

import { endpointDashboard, serviceDashboard } from 'in-applications/navigation/paths';
import { endpointId as matrixEndpointId, serviceId as matrixServiceId } from 'in-applications/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
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
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}/summary`;
    setOrDeleteMatrixKey(params, serviceDashboard, matrixServiceId, serviceId);
  });
}

function getLinkToEndpoint(serviceId, endpointId) {
  return getModifiedUrlStream(params => {
    params.pathname = `${endpointDashboard}/summary`;
    setOrDeleteMatrixKey(params, endpointDashboard, matrixEndpointId, endpointId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixServiceId, serviceId);
  });
}
