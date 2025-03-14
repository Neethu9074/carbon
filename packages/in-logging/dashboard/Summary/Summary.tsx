/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-ignore
import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
import RetentionPeriodDashboard from 'in-logging/dashboard/Summary/RetentionPeriod/RetentionPeriodDashboard';
import LogVolumeDashboard from 'in-logging/dashboard/Summary/LogVolume/LogVolumeDashboard';
import { getLogDistributionConfig, getLogVolumeConfig } from 'in-logging/dashboard/utils';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { isAddonUserCached } from 'in-logging/api/licence';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary() {
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);
  const timeConfig = useTimeConfig();
  const showLogVolume = role?.canViewLogVolume && isLoggingAddonUser;

  const contentToRender = (
    <div className={locals.dashboardContainer}>
      <div className={locals.dashboardCards}>
        <KpiGridRow sizes={[3, 3]}>
          <RetentionPeriodDashboard />
          {showLogVolume && <LogVolumeDashboard />}
        </KpiGridRow>
      </div>
      <CreateLogsSmartAlertFloatingButton />
      <div className={locals.charts}>
        {showLogVolume && (
          <UnifiedMetricsChart
            renderLegend={false}
            timeConfig={timeConfig}
            title={t('in-logging:dashboard.managementPage.logVolume')}
            config={getLogVolumeConfig()}
          />
        )}
        <UnifiedMetricsChart
          timeConfig={timeConfig}
          title={t('in-logging:logsCountSum')}
          config={getLogDistributionConfig() as Config}
        />
      </div>
    </div>
  );

  return <LoggingDashboardWrapper>{contentToRender}</LoggingDashboardWrapper>;
}
