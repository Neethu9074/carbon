/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import {
  dashboardConfigurationPath,
  dashboardIntegrationsPath,
  dashboardLogVolumePath,
  dashboardRetentionConfigurationPath,
  loggingDashboardPath
} from 'in-logging/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './Configuration.mless';

const localisationStrings = {
  configuration: t('in-logging:dashboard.configuration'),
  logs: t('in-logging:logs')
};

const locationLabels = [
  { path: dashboardLogVolumePath, label: t('in-logging:dashboard.configurationPage.logVolume') },
  { path: dashboardIntegrationsPath, label: t('in-logging:dashboard.configurationPage.logIntegrations') },
  { path: dashboardRetentionConfigurationPath, label: t('in-logging:dashboard.configurationPage.retentionPeriod') }
];

export default function Breadcrumbs() {
  const { createHrefToPath, matchLocation } = useNavigation();

  return (
    <div className={locals.crumbs}>
      <Link href={createHrefToPath(loggingDashboardPath)}>{localisationStrings.logs}</Link>
      <span>/</span>
      <Link href={createHrefToPath(dashboardConfigurationPath)}>{localisationStrings.configuration}</Link>
      <span>/</span>
      <Link>{locationLabels.find(location => matchLocation(location.path))?.label}</Link>
    </div>
  );
}
