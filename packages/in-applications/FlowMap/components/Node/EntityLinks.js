/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import { t } from 'in-i18n';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export function ServiceLink({ serviceId, node, isOutofAppContext, boundaryScope, className, children }) {
  const link = (
    <EntityLink className={className} getLink={() => getLinkToService(node.applicationId, serviceId, boundaryScope)}>
      {children}
    </EntityLink>
  );
  return isOutofAppContext ? (
    <Tooltip content={t('in-applications:flowMap.tooltipServiceNotInApplication')}>{link}</Tooltip>
  ) : (
    link
  );
}

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

const EntityLink = forwardRef(function EntityLink({ className, getLink, children }, ref) {
  return (
    <div className={`${locals.entityLinkWrapper} ${className}`} ref={ref}>
      <Link className={`${locals.entityLink}`} href$={getLink()}>
        {children}
      </Link>
    </div>
  );
});

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
