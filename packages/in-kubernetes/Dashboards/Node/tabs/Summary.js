/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: node }) {
  const snapshotId = node.id;
  const { teal800: capacity, orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={node.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title="Status"
          value={<Capitalize>{node.status || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title="Roles"
          value={<Capitalize>{node.roles || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title="Age"
          value={<Capitalize>{node.age ? formatDuration(node.age) : valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests Alloc."
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests Alloc."
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="alloc_pods_percentage"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card title="CPU Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: ['cpu.total_usage', 'required_cpu', 'limit_cpu', 'cap_cpu'].filter(Boolean),
                labels: ['Usage', 'Requests', 'Limits', 'Capacity'].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: ['memory.usage', 'required_mem', 'limit_mem', 'cap_mem'].filter(Boolean),
                labels: ['Usage', 'Requests', 'Limits', 'Capacity'].filter(Boolean),
                type: 'line',
                colors: [usage, requests, limits, capacity].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods Allocation">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['allocatedPods', 'cap_pods'],
                labels: ['Allocated', 'Capacity'],
                type: 'line'
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={node.conditions}
            viewAllHref$={getNodeDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
