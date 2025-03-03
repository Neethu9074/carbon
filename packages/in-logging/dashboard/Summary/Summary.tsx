/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { IconButton, Tooltip } from '@instana/components';
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import RetentionPeriodDashboard from './RetentionPeriod/RetentionPeriodDashboard';
// @ts-ignore
import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/Charts/LogsDistributionChartSection';
// eslint-disable-next-line no-restricted-imports
import LogVolumeDashboard from './LogVolume/LogVolumeDashboard';
import { LoggingAnalyzeContextWrapper } from 'in-logging/analyze/AnalyzeView/LoggingAnalyzeContext';
import { loggingDashboardPath, logsPathWithDataSource } from 'in-logging/navigation/paths';
import { dataSourceConfigurations } from 'in-logging/analyze/AnalyzeView/utils/constants';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { getMetricTemplates } from 'in-applications/api/metricTemplates';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { isAddonUserCached } from 'in-logging/api/licence';
import { getTagCatalog } from 'in-logging/api/catalog';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary() {
  const { createHrefToPath } = useNavigation();
  const goToLogs = createHrefToPath(logsPathWithDataSource);
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  const iconWithTooltip = role?.canViewLogs && isLoggingAddonUser && (
    <Tooltip content={t('in-logging:dashboard.analyzeLogs')} align="leftMiddle">
      <IconButton aria-label={'go-to-logs-link'} kind="subtle" type={'lib_analyze'} href={goToLogs} />
    </Tooltip>
  );

  const contentToRender = (
    <div className={locals.dashboardContainer}>
      <div className={locals.dashboardCards}>
        <KpiGridRow sizes={[3, 3]}>
          <RetentionPeriodDashboard />
          {role?.canViewLogVolume && isLoggingAddonUser && <LogVolumeDashboard />}
        </KpiGridRow>
      </div>
      <StateManagement
        path={loggingDashboardPath}
        defaultDataSource="logs"
        dataSourceParameter={logIdMatrixParameter}
        getTagCatalog={getTagCatalog}
        getMetricTemplates={getMetricTemplates}
        dataSourceConfigurations={dataSourceConfigurations}
      >
        {(opts: any) => (
          <LoggingAnalyzeContextWrapper>
            <LogsDistributionChartSection
              {...opts}
              disableClose={false}
              hideRenderer
              showHeader
              rightHeaderContent={iconWithTooltip}
              isDashboard
            />
          </LoggingAnalyzeContextWrapper>
        )}
      </StateManagement>
      <CreateLogsSmartAlertFloatingButton />
    </div>
  );

  return <LoggingDashboardWrapper>{contentToRender}</LoggingDashboardWrapper>;
}
