/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { ChartProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/types';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function EtcdOpsChart({ snapshotId, timeConfig }: ChartProps) {
  return (
    <>
      <Card title={t('in-kubernetes:dashboards.operations')} useMaxAvailableHeight>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'health.create_v3',
              'health.update_v3',
              'health.delete_v3',
              'health.compare_and_swap_v3',
              'health.compare_and_delete_v3'
            ],
            labels: [
              t('in-kubernetes:dashboards.create'),
              t('in-kubernetes:dashboards.update'),
              t('in-kubernetes:dashboards.delete'),
              t('in-kubernetes:dashboards.cas'),
              t('in-kubernetes:dashboards.cad')
            ],
            formatter: zeroDecimalPlaces,
            type: 'line',
            aggregation: 'sum'
          }}
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      </Card>
    </>
  );
}
