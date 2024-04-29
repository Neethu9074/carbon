/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';

import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { timeByMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { k8sChartColors } from 'in-kubernetes/components/K8sChartColors';
import { useDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

const noActivity = t('in-kubernetes:dashboards.noActivity');
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

export default function Summary({ timeConfig, data: deployment }) {
  const snapshotId = deployment.id;
  const { usage, limits, requests, pending, allocated, unscheduled, unready } = k8sChartColors;
  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.deployment', snapshotId, timeConfig);
  const viewAllHref = useDeploymentDashboard(snapshotId, { tab: '/conditions' });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={deployment.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            snapshotId={snapshotId}
            metric="pods.required_cpu"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            snapshotId={snapshotId}
            metric="pods.limit_cpu"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            snapshotId={snapshotId}
            metric="pods.required_mem"
            formatter={resourceQuotaBytes}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            snapshotId={snapshotId}
            metric="pods.limit_mem"
            formatter={resourceQuotaBytes}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            snapshotId={snapshotId}
            metric="pods.count"
            formatter={zeroDecimalPlaces}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: ['cpu.total_usage', 'pods.required_cpu', 'pods.limit_cpu'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.memoryResources')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: ['memory.usage', 'pods.required_mem', 'pods.limit_mem'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.pods')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: [
                  'pods.count',
                  'phase.Pending.count',
                  'conditions.PodScheduled.False',
                  'conditions.Ready.False'
                ],
                labels: [
                  t('in-kubernetes:dashboards.allocated'),
                  t('in-kubernetes:dashboards.pending'),
                  t('in-kubernetes:dashboards.unscheduled'),
                  t('in-kubernetes:dashboards.unready')
                ],
                type: 'line',
                colors: [allocated, pending, unscheduled, unready]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper tagFilterExpression={logsChartQuery} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card title={t('in-kubernetes:dashboards.replicas')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: zeroDecimalPlaces,
                metrics: ['availableReplicas', 'desiredReplicas'],
                labels: [t('in-kubernetes:dashboards.available'), t('in-kubernetes:dashboards.desired')],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-kubernetes:dashboards.pendingPhaseDuration')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: msFormatter,
                metrics: ['duration'],
                labels: [t('in-kubernetes:dashboards.pendingPhaseDuration')],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTableCard conditions={deployment.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
