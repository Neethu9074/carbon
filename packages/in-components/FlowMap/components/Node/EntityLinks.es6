import React from 'react';

import {
  endpointId as matrixEndpointId,
  serviceId as matrixServiceId,
  applicationId as matrixApplicationId
} from 'in-applications/navigation/matrix';
import { endpointDashboard, serviceDashboard } from 'in-applications/navigation/paths';
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
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}/summary`;
    setOrDeleteMatrixKey(params, serviceDashboard, matrixApplicationId, null);
    setOrDeleteMatrixKey(params, serviceDashboard, matrixServiceId, serviceId);
  });
}

function getLinkToEndpoint(serviceId, endpointId) {
  if (isUnspecified(serviceId) || isUnspecified(endpointId)) {
    return null;
  }
  return getModifiedUrlStream(params => {
    params.pathname = `${endpointDashboard}/summary`;
    setOrDeleteMatrixKey(params, serviceDashboard, matrixApplicationId, null);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixEndpointId, endpointId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixServiceId, serviceId);
  });
}

function isUnspecified(id) {
  return id === 'Unspecified';
}
