/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesClusterTagEquals,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { useNodeDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { capitalizeValue } from 'in-components/Capitalize';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function SummaryWithoutTimeShift({ timeConfig, data: node }) {
  const snapshotId = node.id;
  const { teal800: capacity, orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  const clusterTag = kubernetesClusterTagEquals(node.clusterId);
  const workloadTag = tagEquals('kubernetes.node.name', node.name);

  const viewAllHref = useNodeDashboard(snapshotId, { tab: '/conditions' });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={node.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={node.status}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.roles')}
          value={node.roles}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={node.age}
          renderValue={nodeAge => capitalizeValue(formatDuration(nodeAge))}
          raw
          borderless
        />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuRequestsAlloc')}
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuLimitsAlloc')}
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryRequestsAlloc')}
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.podsAlloc')}
            snapshotId={snapshotId}
            metric="alloc_pods_percentage"
            formatter={percentage.detailed}
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
                metrics: ['cpu.total_usage', 'required_cpu', 'limit_cpu', 'cap_cpu'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
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
                metrics: ['memory.usage', 'required_mem', 'limit_mem', 'cap_mem'].filter(Boolean),
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits'),
                  t('in-kubernetes:dashboards.capacity')
                ].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title={t('in-kubernetes:dashboards.podsAllocation')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['allocatedPods', 'cap_pods'],
                labels: [t('in-kubernetes:dashboards.allocated'), t('in-kubernetes:dashboards.capacity')],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, workloadTag)}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard conditions={node.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
