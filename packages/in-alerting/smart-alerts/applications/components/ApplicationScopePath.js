/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
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
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  if (applicationName) {
    entries.push({
      iconType: 'lib_application',
      label: applicationName,
      href:
        showDashboardLinks &&
        applicationId &&
        getLinkToApplicationDashboard({
          applicationId,
          timeConfig,
          boundaryScope
        })
    });
  }

  if (serviceName) {
    entries.push({
      iconType: 'lib_application_service',
      label: serviceName,
      href:
        showDashboardLinks &&
        serviceId &&
        getLinkToServiceDashboard({
          applicationId,
          serviceId,
          timeConfig,
          boundaryScope
        })
    });
  }

  if (endpointName) {
    entries.push({
      iconType: 'lib_application_endpoint',
      label: endpointName,
      href:
        showDashboardLinks &&
        endpointId &&
        getLinkToEndpointDashboard({
          applicationId,
          serviceId,
          endpointId,
          timeConfig,
          boundaryScope
        })
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
