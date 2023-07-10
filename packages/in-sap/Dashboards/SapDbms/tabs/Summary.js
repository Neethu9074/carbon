/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import { number, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import Columize from 'in-sdk/components/dashboard/Columize';
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

      <Columize>
        <DashboardSection title={t('in-sap:dashboards.dbAvailability')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Availability.DB2_Database_Status.DB6_DATABASE_STATUS.value',
                'metrics.Availability.DB2_Instance_Status.DB6_INSTANCE_STATUS.value'
              ],
              labels: [t('in-sap:dashboards.DB2_Database_Status'), t('in-sap:dashboards.DB2_Instance_Status')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.dbExceptions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Exceptions.Corrupt_page.DIA8400C.value',
                'metrics.Exceptions.Disk_Error.SQL0980C.value'
              ],
              labels: [t('in-sap:dashboards.Corrupt_page'), t('in-sap:dashboards.Disk_Error')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.lockStats')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Exceptions.Number_of_Deadlocks_Since_DB_Start.DB2_DEADLOCKS.value',
                  'metrics.Exceptions.Number_of_Lock_Escalations_Since_DB_Start.DB2_LOCK_ESCALATION.value',
                  'metrics.Exceptions.Number_of_Lock_Timeouts_Since_DB_Start.DB2_LOCKTIMEOUT.value'
                ],
                labels: [
                  t('in-sap:dashboards.noOfDeadlocks'),
                  t('in-sap:dashboards.deadlockEscalation'),
                  t('in-sap:dashboards.lockTimeout')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.logs')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Exceptions.Transaction_Log_Full.SQL0964C.value'],
                labels: [t('in-sap:dashboards.transactionLogFull')],
                type: 'line'
              }}
              y2={{
                metrics: ['metrics.Exceptions.Primary_Logs_Fill_Ratio.DB6_PRIMARY_LOGS_FILL_RATIO.value'],
                labels: [t('in-sap:dashboards.primaryLogFill')],
                type: 'line',
                formatter: percentagePlainZeroDecimalPlaces
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
