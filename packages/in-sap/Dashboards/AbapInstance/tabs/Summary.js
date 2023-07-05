/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import { number, millis, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
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
        <DashboardSection title={t('in-sap:dashboards.dialogResources')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.Dialog_Resources.NUMBER_OF_DIALOG_WORK_PROCESSE.value',
                'metrics.Performance.Dialog_Resources.NUMBER_OF_FREE_DIALOG_WORK_PRO.value'
              ],
              labels: [t('in-sap:dashboards.noWorkProcess'), t('in-sap:dashboards.noFreeProcess')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.dialogResp')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.Dialog_Response_Time.DIALOG_DB_REQUEST_TIME.value',
                'metrics.Performance.Dialog_Response_Time.DIALOG_RESPONSE_TIME.value',
                'metrics.Performance.Dialog_Response_Time.DIALOG_QUEUE_TIME.value'
              ],
              labels: [
                t('in-sap:dashboards.reqTime'),
                t('in-sap:dashboards.resTime'),
                t('in-sap:dashboards.queueTime')
              ],
              type: 'line',
              formatter: millis
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-sap:dashboards.icm')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_CONNECTIONS.value',
                'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_REQUESTS_IN_QUEU.value',
                'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_THREADS.value'
              ],
              labels: [
                t('in-sap:dashboards.icmConnection'),
                t('in-sap:dashboards.reqInQueue'),
                t('in-sap:dashboards.icmThreads')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.gatewayResource')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.Gateway_Resources.GATEWAY_CLIENT_USAGE__ob_%_cb_.value',
                'metrics.Performance.Gateway_Resources.GATEWAY_COMMUNICATION_USAGE__ob_%.value',
                'metrics.Performance.Gateway_Resources.GATEWAY_CONNECTION_USAGE__ob_%_cb_.value'
              ],
              labels: [
                t('in-sap:dashboards.clientUsage'),
                t('in-sap:dashboards.communicationUsage'),
                t('in-sap:dashboards.connectionUsage')
              ],
              type: 'line',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.userLoad')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_DIALOG_USERS.value',
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_HTTP_USERS.value',
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_RFC_USERS.value',
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_TOTAL_USERS.value'
                ],
                labels: [
                  t('in-sap:dashboards.dialogUsers'),
                  t('in-sap:dashboards.httpUsers'),
                  t('in-sap:dashboards.rfcUser'),
                  t('in-sap:dashboards.totalUsers')
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
