/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import ScopePath from 'in-alerting/components/ScopePath';

export default function ApplicationScopePath({
  boundaryScope,
  applicationId,
  applicationName,
  serviceId,
  serviceName,
  endpointId,
  endpointName,
  timeConfig,
  iconSize,
  showDashboardLinks,
  noBottomMargin
}) {
  const entries = [];

  if (applicationName) {
    entries.push({
      iconType: 'lib_application',
      label: applicationName,
      href$:
        showDashboardLinks &&
        applicationId &&
        getApplicationDashboard(applicationId, {
          timeConfig,
          boundaryScope
        })
    });
  }

  if (serviceName) {
    entries.push({
      iconType: 'lib_application_service',
      label: serviceName,
      href$:
        showDashboardLinks &&
        serviceId &&
        getServiceDashboard(serviceId, {
          applicationId,
          timeConfig,
          boundaryScope
        })
    });
  }

  if (endpointName) {
    entries.push({
      iconType: 'lib_application_endpoint',
      label: endpointName,
      href$:
        showDashboardLinks &&
        endpointId &&
        getEndpointDashboard(endpointId, {
          applicationId,
          serviceId,
          timeConfig,
          boundaryScope
        })
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
