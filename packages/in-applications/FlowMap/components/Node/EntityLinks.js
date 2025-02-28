/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { useLinkToEndpointDashboard, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './EntityLink.mless';

export function ServiceLink({ serviceId, node, isOutofAppContext, boundaryScope, className, children }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  const link = (
    <EntityLink
      className={className}
      getLink={() => getLinkToService(node.applicationId, serviceId, boundaryScope, getLinkToServiceDashboard)}
    >
      {children}
    </EntityLink>
  );
  return isOutofAppContext ? (
    <Tooltip content={t('in-applications:flowMap.tooltipServiceNotInApplication')}>{link}</Tooltip>
  ) : (
    link
  );
}

export function EndpointLink({ node, className, children, data, boundaryScope }) {
  const serviceData = useObservable(node.events$.on('data'), [node]);
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();
  return (
    <EntityLink
      className={className}
      getLink={() =>
        getLinkToEndpoint(node.applicationId, serviceData?.id, data.id, boundaryScope, getLinkToEndpointDashboard)
      }
    >
      {children}
    </EntityLink>
  );
}

const EntityLink = forwardRef(function EntityLink({ className, getLink, children }, ref) {
  return (
    <div className={`${locals.entityLinkWrapper} ${className}`} ref={ref}>
      <Link className={`${locals.entityLink}`} href={getLink()}>
        {children}
      </Link>
    </div>
  );
});

function getLinkToService(applicationId, serviceId, boundaryScope, getLinkToServiceDashboard) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getLinkToServiceDashboard({ applicationId, serviceId, boundaryScope });
}

function getLinkToEndpoint(applicationId, serviceId, endpointId, boundaryScope, getLinkToEndpointDashboard) {
  if (isUnspecified(serviceId)) {
    return null;
  }
  return getLinkToEndpointDashboard({ endpointId, serviceId, applicationId, boundaryScope });
}

function isUnspecified(id) {
  return id === 'Unspecified';
}
