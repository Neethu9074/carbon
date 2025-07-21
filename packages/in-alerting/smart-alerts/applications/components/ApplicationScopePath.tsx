/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig, BoundaryScope } from '@instana/types';
import { SvgIconProps } from '@instana/components';

import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
import ScopePath from 'in-alerting/components/ScopePath';

type SvgIconSize = SvgIconProps['size'];
interface ApplicationScopePathProps {
  boundaryScope?: BoundaryScope;
  applicationId: string;
  applicationName?: string | null;
  serviceId?: string;
  serviceName?: string;
  endpointId?: string;
  endpointName?: string;
  timeConfig?: TimeConfig;
  iconSize?: SvgIconSize;
  showDashboardLinks?: boolean;
  noBottomMargin: boolean;
}
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
}: ApplicationScopePathProps) {
  const entries = [];
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  if (applicationName) {
    entries.push({
      iconType: 'lib_application',
      label: applicationName,
      href:
        showDashboardLinks && applicationId
          ? getLinkToApplicationDashboard({
              applicationId,
              timeConfig,
              boundaryScope
            })
          : undefined
    });
  }

  if (serviceName) {
    entries.push({
      iconType: 'lib_application_service',
      label: serviceName,
      href:
        showDashboardLinks && serviceId
          ? getLinkToServiceDashboard({
              applicationId,
              serviceId,
              timeConfig,
              boundaryScope
            })
          : undefined
    });
  }

  if (endpointName) {
    entries.push({
      iconType: 'lib_application_endpoint',
      label: endpointName,
      href:
        showDashboardLinks && endpointId
          ? getLinkToEndpointDashboard({
              applicationId,
              serviceId,
              endpointId,
              timeConfig,
              boundaryScope
            })
          : undefined
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
