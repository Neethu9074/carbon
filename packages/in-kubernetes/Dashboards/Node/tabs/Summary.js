import React, { Fragment } from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

const showUsage = isAdhocMetricAggregationEnabled;

export default function Summary({ timeConfig, data: node }) {
  const snapshotId = node.id;
  const { teal800: capacity, orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
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
            title="CPU Usage"
            snapshotId={snapshotId}
            metric="cpu.user_usage"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits"
            snapshotId={snapshotId}
            metric="limit_cpu"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Usage"
            snapshotId={snapshotId}
            metric="memory.usage"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits"
            snapshotId={snapshotId}
            metric="limit_mem"
            formatter={resourceQuotaBytes}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods"
            snapshotId={snapshotId}
            metric="allocatedPods"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Cap."
            snapshotId={snapshotId}
            metric="cap_pods"
            formatter={zeroDecimalPlaces}
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
                metrics: [showUsage && 'cpu.user_usage', 'required_cpu', 'limit_cpu', 'cap_cpu'].filter(Boolean),
                labels: [showUsage && 'Usage', 'Requests', 'Limits', 'Capacity'].filter(Boolean),
                type: 'line',
                colors: [showUsage && usage, requests, limits, capacity].filter(Boolean)
              }}
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
                metrics: [showUsage && 'memory.usage', 'required_mem', 'limit_mem', 'cap_mem'].filter(Boolean),
                labels: [showUsage && 'Usage', 'Requests', 'Limits', 'Capacity'].filter(Boolean),
                type: 'line',
                colors: [showUsage && usage, requests, limits, capacity].filter(Boolean)
              }}
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
