import React, { Fragment } from 'react';

import {
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces,
  resourceQuotaTwoDecimalPlaces
} from 'in-forge/plugins/kubernetesCluster/formatters/resourceQuota';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import Chart from 'in-components/Chart';

export default function Summary({ timeConfig, data: namespace }) {
  const snapshotId = namespace.id;

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Status" value={namespace.status} raw />
        </Col>
        <Col lg={6}>
          <KpiCard title="Creation Time" value={formatDateTime(namespace.created)} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <TopDeploymentsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHref$={getNamespaceDashboard(namespace.id, {
              tab: '/deployments'
            })}
          />
        </Col>
        <Col lg={6}>
          <TopPodsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHref$={getNamespaceDashboard(namespace.id, {
              tab: '/pods'
            })}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
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
        <Col lg={4}>
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
        <Col lg={4}>
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
