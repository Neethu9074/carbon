/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import AbapShortDumps from 'in-sap/Dashboards/SapAbapSensor/tabs/AbapShortDumps.js';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  const statusFormatter = status => {
    switch (status) {
      case 1:
        return 'ACTIVE';
      case 0:
        return 'INACTIVE';
      default:
        return '-';
    }
  };
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.connectionStatus')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.status"
            formatter={statusFormatter}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.workProcessCount')}
            snapshotId={snapshotId}
            metric="workloadcounts.workProcessRowCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.dbConnectionCount')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.dbConnectionCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.totalMemory')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.totalMemory"
            formatter={bytes.compact}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.noOfDumps')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.numberOfDumps"
            formatter={number.compact}
          />
        </Col>
      </Row>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.workProcessStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'workloadcounts.numberOfDialogProcess',
                'workloadcounts.numberOfSpoolProcess',
                'workloadcounts.numberOfBatchProcess',
                'workloadcounts.numberOfEnqueueProcess'
              ],
              labels: [
                t('in-sap:dashboards.numberOfDialogProcess'),
                t('in-sap:dashboards.numberOfSpoolProcess'),
                t('in-sap:dashboards.numberOfBatchProcess'),
                t('in-sap:dashboards.numberOfEnqueueProcess')
              ],
              type: 'stackedBar',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.workProcessState')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['workloadcounts.onHold', 'workloadcounts.running', 'workloadcounts.waiting'],
              labels: [t('in-sap:dashboards.onHold'), t('in-sap:dashboards.running'), t('in-sap:dashboards.waiting')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.updateWorkProcess')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['workloadcounts.numberOfUpdateProcess', 'workloadcounts.numberOfUpdate2Process'],
              labels: [t('in-sap:dashboards.numberOfUpdateProcess'), t('in-sap:dashboards.numberOfUpdate2Process')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.totalUsers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.userName'],
              labels: [t('in-sap:dashboards.numberOfUsers')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.rfcStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.totalRFCCalls'],
              labels: [t('in-sap:dashboards.totalRFCCalls')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <AbapShortDumps snapshotId={snapshotId} />
      </Columize>
    </Fragment>
  );
}
