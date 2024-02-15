/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import * as paths from 'in-logging/navigation/paths';
import { t } from 'in-i18n';

export default function ViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();

  const isAnalyticsActive = matchLocation(paths.logsPath) && !matchLocation(paths.alertsFullyQualifiedPath);
  const isSmartAlertActive = matchLocation(paths.alertsFullyQualifiedPath);

  return (
    <>
      <DashboardHeaderModule theme={themes.light} withTopBorder={false} withBottomBorder>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(`${paths.logsPath};dataSource=logs`)}
            label={t('in-analyze:components.analyzeHeader.analytics')}
            isActive={isAnalyticsActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(`${paths.logsPath};dataSource=logs${paths.alertsPath}`)}
            label={t('in-alerting:smartAlerts.smartAlertsTitle')}
            isActive={isSmartAlertActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
