/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { Breadcrumb, BreadcrumbItem } from '@carbon/react';
import React from 'react';

import {
  dashboardManagementPath,
  dashboardIntegrationsPath,
  dashboardLogVolumePath,
  dashboardRetentionManagementPath,
  loggingDashboardPath,
  dashboardPatternRecognitionPath
} from 'in-logging/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './Management.mless';

const localisationStrings = {
  management: t('in-logging:dashboard.management'),
  logs: t('in-logging:logs')
};

const locationLabels = [
  { path: dashboardLogVolumePath, label: t('in-logging:dashboard.managementPage.logVolume') },
  { path: dashboardIntegrationsPath, label: t('in-logging:dashboard.managementPage.logIntegrations') },
  { path: dashboardRetentionManagementPath, label: t('in-logging:dashboard.managementPage.retentionPeriod') },
  { path: dashboardPatternRecognitionPath, label: t('in-logging:dashboard.managementPage.patternRecognition') }
];

export default function Breadcrumbs() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const currentLocation = locationLabels.find(location => matchLocation(location.path));

  return (
    <Breadcrumb noTrailingSlash className={locals.crumbs}>
      <BreadcrumbItem href={createHrefToPath(loggingDashboardPath)}>{localisationStrings.logs}</BreadcrumbItem>
      <BreadcrumbItem href={createHrefToPath(dashboardManagementPath)}>{localisationStrings.management}</BreadcrumbItem>
      {currentLocation && (
        <BreadcrumbItem isCurrentPage href={createHrefToPath(currentLocation.path)}>
          {currentLocation.label}
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}
