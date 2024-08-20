/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import EtcdOpsChart from './EtcdOpsChart';
import { ChartProps } from './types';

export default function EtcdChartsV2({ snapshotId, timeConfig }: ChartProps) {
  return (
    <>
      <Row verticallyStretchColumns>
        <Col lg>
          <Card title={t('in-kubernetes:dashboards.requests')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['health.requests_received', 'requests_sent'],
                labels: [t('in-forge:plugins.etcd.dashboard.received'), t('in-forge:plugins.etcd.dashboard.sent')],
                formatter: bytesZeroDecimalPlaces,
                type: 'line',
                aggregation: 'sum'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg>
          <Card title={t('in-kubernetes:dashboards.traffic')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
                labels: [t('in-forge:plugins.etcd.dashboard.received'), t('in-forge:plugins.etcd.dashboard.sent')],
                formatter: bytesZeroDecimalPlaces,
                type: 'line',
                aggregation: 'sum'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg>
          <EtcdOpsChart snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
    </>
  );
}
