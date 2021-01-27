/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import ScopePath from 'in-new-components/Alerting/components/ScopePath';

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

  if (applicationId && applicationName) {
    entries.push({
      iconType: 'lib_application',
      label: applicationName,
      href$:
        showDashboardLinks &&
        getApplicationDashboard(applicationId, {
          timeConfig,
          boundaryScope
        })
    });
  }

  if (serviceId && serviceName) {
    entries.push({
      iconType: 'lib_application_service',
      label: serviceName,
      href$:
        showDashboardLinks &&
        getServiceDashboard(serviceId, {
          applicationId,
          timeConfig,
          boundaryScope
        })
    });
  }

  if (endpointId && endpointName) {
    entries.push({
      iconType: 'lib_application_endpoint',
      label: endpointName,
      href$:
        showDashboardLinks &&
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
