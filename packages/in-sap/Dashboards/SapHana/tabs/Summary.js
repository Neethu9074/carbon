/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { percentagePlainZeroDecimalPlaces, minutes } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.overallRating')}
          value={getOverallStatus(sap.overallRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.overallRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallAvailability')}
          value={getOverallStatus(sap.availRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.availRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallPerformance')}
          value={getOverallStatus(sap.perfRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.perfRating)}
        />
      </KpiGridRow>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.overallException')}
          value={getOverallStatus(sap.excepRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.excepRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallConfiguration')}
          value={getOverallStatus(sap.configRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.configRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.selfMonitorRating')}
          value={getOverallStatus(sap.selfMonitorRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.selfMonitorRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <DashboardSection title={t('in-sap:dashboards.syncRatio')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'metrics.Performance.Sync\\/Async_Read_Ratio.HDB_STATISTICS_ALERT_060.value',
              'metrics.Performance.Sync\\/Async_Write_Ratio.HDB_STATISTICS_ALERT_061.value'
            ],
            labels: [t('in-sap:dashboards.syncReadRatio'), t('in-sap:dashboards.syncWriteRatio')],
            type: 'line',
            formatter: percentagePlainZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-sap:dashboards.transactionStats')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'metrics.Performance.Long-Running_Uncommitted_Write_Transactions.HDB_STATISTICS_ALERT_048_.value',
              'metrics.Performance.Long-Running_Blocking_Situations.HDB_STATISTICS_ALERT_049_.value'
            ],
            labels: [t('in-sap:dashboards.writeTransaction'), t('in-sap:dashboards.blockingSituations')],
            type: 'line',
            formatter: minutes
          }}
          y2={{
            min: 0,
            metrics: ['metrics.Performance.Percentage_of_Transactions_Blocked.HDB_STATISTICS_ALERT_059_.value'],
            labels: [t('in-sap:dashboards.transactionsBlocked')],
            type: 'line',
            formatter: percentagePlainZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Fragment>
  );
}
