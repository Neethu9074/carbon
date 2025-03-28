/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import {
  dashboardManagementPath,
  dashboardIntegrationsPath,
  dashboardLogVolumePath,
  dashboardRetentionManagementPath,
  loggingDashboardPath
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
  { path: dashboardRetentionManagementPath, label: t('in-logging:dashboard.managementPage.retentionPeriod') }
];

export default function Breadcrumbs() {
  const { createHrefToPath, matchLocation } = useNavigation();

  return (
    <section className={locals.crumbs} aria-label="Page Navigation">
      <Link href={createHrefToPath(loggingDashboardPath)}>{localisationStrings.logs}</Link>
      <span>/</span>
      <Link href={createHrefToPath(dashboardManagementPath)}>{localisationStrings.management}</Link>
      <span>/</span>
      <Link>{locationLabels.find(location => matchLocation(location.path))?.label}</Link>
    </section>
  );
}
