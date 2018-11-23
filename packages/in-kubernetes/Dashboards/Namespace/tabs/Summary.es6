import React, { Fragment } from 'react';

import {
  resourceQuotaPercentage,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces,
  resourceQuotaTwoDecimalPlaces
} from 'in-forge/plugins/kubernetesCluster/formatters/resourceQuota';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

export default function Summary({ timeConfig, data: namespaceItem }) {
  const namespace = namespaceItem.namespace;
  const snapshotId = namespace.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Status" value={namespace.status} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Creation Time" value={formatDateTime(namespace.created)} raw />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests Alloc."
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests Alloc."
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="used_pods_percentage"
            formatter={resourceQuotaPercentage}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card title="CPU Requests / Limits">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaTwoDecimalPlaces,
                metrics: [`cap_requests_cpu`, `used_requests_cpu`, `cap_limits_cpu`, `used_limits_cpu`],
                labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits', 'Used Limits'],
                type: 'line',
                min: 0
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Memory Requests / Limits">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: [`cap_requests_memory`, `used_requests_memory`, `cap_limits_memory`, `used_limits_memory`],
                labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits ', 'Used Limits'],
                type: 'line',
                min: 0
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card title="Pods Allocation">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaZeroDecimalPlaces,
                metrics: ['used_pods', 'cap_pods'],
                labels: ['Used Pods', 'Pods Capacity'],
                type: 'line',
                min: 0
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
