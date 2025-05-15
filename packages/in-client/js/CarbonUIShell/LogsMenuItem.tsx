/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isLoggingView, loggingDashboardPath } from 'in-logging/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { loggingEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function LogsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!loggingEnabled || !role?.canViewLogs) return null;

  return (
    <MenuItem
      id="main-nav-logging"
      label={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
      icon="lib_application_logging"
      isActive={matchLocation(isLoggingView)}
      href={createHrefToPath(loggingDashboardPath)}
    />
  );
}
