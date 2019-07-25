import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  resourceQuotaPercentage,
  resourceQuotaNumber,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces
} from 'in-kubernetes/formatters';
import TopDeploymentsList from 'in-kubernetes/Dashboards/commonComponents/TopDeploymentsList';
import ResourceQuotaChart from 'in-kubernetes/Dashboards/commonComponents/ResourceQuotaChart';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import TopPodsList from 'in-kubernetes/Dashboards/commonComponents/TopPodsList';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

const showUsage = isAdhocMetricAggregationEnabled;

export default function Summary({ timeConfig, data: namespace }) {
  const snapshotId = namespace.id;
  const {
    indigo800: hardLimits,
    purple800: hardRequests,
    orange800: limits,
    lime800: requests,
    slushGreen800: pods,
    lightBlue800: usage
  } = theme.lib.colors;

  return (
    <Fragment>
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard title="Status" value={namespace.status} raw borderless />
        <KpiCard
          title="Age"
          value={namespace.age ? formatDuration(namespace.age) : valueMissingPlaceholder}
          raw
          borderless
        />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Req. Alloc."
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
            title="Memory Req. Alloc."
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

      <Row verticallyStretchColumns>
        <Col lg={4}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <ResourceQuotaChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              metrics={['cap_requests_cpu', 'used_requests_cpu', 'cap_limits_cpu', 'used_limits_cpu']}
              renderChart={() => (
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: resourceQuotaNumber,
                    metrics: [
                      `cap_requests_cpu`,
                      `used_requests_cpu`,
                      `cap_limits_cpu`,
                      `used_limits_cpu`,
                      showUsage && 'cpu.user_usage'
                    ].filter(Boolean),
                    labels: [
                      'Hard Requests',
                      'Used Requests',
                      'Hard Limits',
                      'Used Limits',
                      showUsage && 'Usage'
                    ].filter(Boolean),
                    type: 'line',
                    min: 0,
                    colors: [hardRequests, requests, hardLimits, limits, usage]
                  }}
                />
              )}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources" useMaxAvailableHeight>
            <ResourceQuotaChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              metrics={['cap_requests_memory', 'used_requests_memory', 'cap_limits_memory', 'used_limits_memory']}
              renderChart={() => (
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: resourceQuotaBytes,
                    metrics: [
                      'cap_requests_memory',
                      'used_requests_memory',
                      'cap_limits_memory',
                      'used_limits_memory',
                      showUsage && 'memory.usage'
                    ].filter(Boolean),
                    labels: [
                      'Hard Requests',
                      'Used Requests',
                      'Hard Limits ',
                      'Used Limits',
                      showUsage && 'Usage'
                    ].filter(Boolean),
                    type: 'line',
                    min: 0,
                    colors: [hardRequests, requests, hardLimits, limits, usage]
                  }}
                />
              )}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods" useMaxAvailableHeight>
            <ResourceQuotaChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              metrics={['used_pods', 'cap_pods']}
              renderChart={() => (
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: resourceQuotaZeroDecimalPlaces,
                    metrics: ['used_pods', 'cap_pods'],
                    labels: ['Used', 'Hard'],
                    type: 'line',
                    min: 0,
                    colors: [pods, hardLimits]
                  }}
                />
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <TopDeploymentsList
            namespaceId={namespace.id}
            timeConfig={timeConfig}
            allItemsHrefs$={{
              deployments: getNamespaceDashboard(namespace.id, {
                tab: '/deployments'
              }),
              deploymentConfigs: getNamespaceDashboard(namespace.id, {
                tab: '/deploymentconfigs'
              })
            }}
            showDeploymentConfigs={get(namespace, ['distributionType'], 'Kubernetes') === 'OpenShift'}
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
    </Fragment>
  );
}
