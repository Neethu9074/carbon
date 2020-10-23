import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export function ServiceLink({ serviceId, node, isOutofAppContext, boundaryScope, className, children }) {
  const link = (
    <EntityLink className={className} getLink={() => getLinkToService(node.applicationId, serviceId, boundaryScope)}>
      {children}
    </EntityLink>
  );
  return isOutofAppContext ? <Tooltip content="The service is not in the current application.">{link}</Tooltip> : link;
}

import connectTo from 'in-hoc/connectTo';

export const EndpointLink = connectTo(
  props => ({
    serviceData: props.node.events$.on('data')
  }),
  function EndpointLink({ node, serviceData, className, children, data, boundaryScope }) {
    return (
      <EntityLink
        className={className}
        getLink={() => getLinkToEndpoint(node.applicationId, serviceData.id, data.id, boundaryScope)}
      >
        {children}
      </EntityLink>
    );
  }
);

function EntityLink({ className, getLink, children }) {
  return (
    <div className={`${locals.entityLinkWrapper} ${className}`}>
      <Link className={`${locals.entityLink}`} href$={getLink()}>
        {children}
      </Link>
    </div>
  );
}

function getLinkToService(applicationId, serviceId, boundaryScope) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getServiceDashboard(serviceId, { applicationId, boundaryScope });
}

function getLinkToEndpoint(applicationId, serviceId, endpointId, boundaryScope) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getEndpointDashboard(endpointId, { serviceId, applicationId, boundaryScope });
}

function isUnspecified(id) {
  return id === 'Unspecified';
}
