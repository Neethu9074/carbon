/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import { number, millis } from 'in-services/formatters/number';
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

      <Columize>
        <DashboardSection title={t('in-sap:dashboards.responseTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.System_response_time.ABAP_SYST_DIALOG_RESPONSETIME_HOUR.value',
                'metrics.Performance.System_response_time.ABAP_SYS_RFC_RESPONSETIME_HOUR.value'
              ],
              labels: [t('in-sap:dashboards.dialogResponseTime'), t('in-sap:dashboards.rFCResponseTime')],
              type: 'line',
              formatter: millis
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.batchJob')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Exceptions.Batch_Jobs.ABAP_SYSTEM_BATCH_JOBS_RUNNING.value',
                'metrics.Exceptions.Batch_Jobs.ABAP_SYS_BATCHJOBS_CANCEL_5MIN.value',
                'metrics.Exceptions.Batch_Jobs.ABAP_SYS_BATCHJOBS_CANCEL_1H.value'
              ],
              labels: [
                t('in-sap:dashboards.batchJobs'),
                t('in-sap:dashboards.batchJobsCancelled'),
                t('in-sap:dashboards.batchJobsCancelledHour')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.serviceThroughput')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Performance.Average_payload_size_sent_per_service_call.GW_SERVICE_THROUGHPUT.value'],
                labels: [t('in-sap:dashboards.averagePayload')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.userLoad')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.User_Load.ABAP_SYST_DIALOG_USERS.value',
                  'metrics.Performance.User_Load.ABAP_SYST_HTTP_USERS.value',
                  'metrics.Performance.User_Load.ABAP_SYST_TOTAL_USERS.value',
                  'metrics.Performance.User_Load.ABAP_SYS_CONCURRENT_USERS.value',
                  'metrics.Performance.User_Load.ABAP_SYS_USERS_PER_APPSERVER.value'
                ],
                labels: [
                  t('in-sap:dashboards.dialogUsers'),
                  t('in-sap:dashboards.httpUsers'),
                  t('in-sap:dashboards.totalUsers'),
                  t('in-sap:dashboards.concurrentUsers'),
                  t('in-sap:dashboards.appServerUsers')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
