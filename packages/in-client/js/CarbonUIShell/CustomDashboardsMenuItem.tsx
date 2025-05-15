/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

// @ts-expect-error promise loader
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

export default function CustomDashboardsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <MenuItem
      id="main-nav-custom-dashboards"
      icon="lib_custom_dashboard"
      label={t('in-components:mainNavigation.viewSwitcherCustomDashboards')}
      isActive={matchLocation(customDashboardsPath)}
      href={createHrefToPath(customDashboardsPath)}
    />
  );
}
