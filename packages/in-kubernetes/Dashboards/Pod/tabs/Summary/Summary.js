import React, { Fragment } from 'react';
import { get } from 'lodash';

import { resourceQuotaBytes, resourceQuotaTwoDecimalPlaces, resourceQuotaNumber } from 'in-kubernetes/formatters';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

const showUsage = isAdhocMetricAggregationEnabled;

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title="Status"
          value={<Capitalize>{get(pod, ['status', 'statusSummary'], valueMissingPlaceholder)}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title="Phase"
          value={<Capitalize>{get(pod, ['status', 'phase'], pod.phase)}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title="Ready Summary"
          value={`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}
          borderless
          raw
        />
        <KpiCard
          title="Restarts"
          value={<MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard title="Age" value={pod.age ? formatDuration(pod.age) : valueMissingPlaceholder} borderless raw />
      </KpiGridRow>

      {message && (
        <Row>
          <Col lg={12}>
            <KpiCard title="Status Message" valuesClassName={locals.message} value={message} raw />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={3}>
          <KpiCard
            title="CPU Requests"
            value={<MetricValue snapshotId={pod.id} metric="cpuRequests" formatter={resourceQuotaNumber} />}
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title="CPU Limits"
            value={<MetricValue snapshotId={pod.id} metric="cpuLimits" formatter={resourceQuotaNumber} />}
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title="Memory Requests"
            value={<MetricValue snapshotId={pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />}
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title="Memory Limits"
            value={<MetricValue snapshotId={pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />}
            raw
          />
        </Col>
      </Row>

      {showUsage && (
        <Row>
          <Col lg={6}>
            <Card title="CPU Resources">
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaTwoDecimalPlaces,
                  metrics: ['cpuRequests', 'cpuLimits', 'cpu.user_usage'],
                  labels: ['Requests', 'Limits', 'Usage'],
                  type: 'line'
                }}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title="Memory Resources">
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: resourceQuotaBytes,
                  metrics: ['memoryRequests', 'memoryLimits', 'memory.usage'],
                  labels: ['Requests', 'Limits', 'Usage'],
                  type: 'line'
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={12}>
          <Card title="Container Status" useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={pod.conditions}
            viewAllHref$={getPodDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
