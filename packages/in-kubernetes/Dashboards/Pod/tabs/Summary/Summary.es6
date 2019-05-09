import React, { Fragment } from 'react';
import { get } from 'lodash';

import PodConditionsPresenter from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/PodConditionsPresenter';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import ResourceQuotaChart from 'in-kubernetes/Dashboards/commonComponents/ResourceQuotaChart';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);

  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <KpiCard title="Status" value={<Capitalize>{get(pod, ['status', 'statusSummary'], '-')}</Capitalize>} raw />
        </Col>
        <Col lg={3}>
          <KpiCard title="Phase" value={<Capitalize>{get(pod, ['status', 'phase'], pod.phase)}</Capitalize>} raw />
        </Col>
        <Col lg={2}>
          <KpiCard
            title="Ready Summary"
            value={`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}
            raw
          />
        </Col>
        <Col lg={2}>
          <KpiCard
            title="Restarts"
            value={<MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />}
            raw
          />
        </Col>
        <Col lg={2}>
          <KpiCard title="Age" value={pod.age ? formatDuration(pod.age) : '-'} raw />
        </Col>
      </Row>

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

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <ResourceQuotaChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              metrics={[`cpuRequests`, `cpuLimits`]}
              renderChart={() => (
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: twoDecimalPlaces,
                    metrics: [`cpuRequests`, `cpuLimits`],
                    labels: ['Requests', 'Limits'],
                    type: 'line',
                    min: 0
                  }}
                />
              )}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Memory Resources" useMaxAvailableHeight>
            <ResourceQuotaChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              metrics={[`memoryRequests`, `memoryLimits`]}
              renderChart={() => (
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: bytesTwoDecimalPlaces,
                    metrics: [`memoryRequests`, `memoryLimits`],
                    labels: ['Requests', 'Limits'],
                    type: 'line',
                    min: 0
                  }}
                />
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <ConditionsTableCard
            conditions={pod.conditions}
            viewAllHref$={getPodDashboard(snapshotId, { tab: '/conditions' })}
            TablePresenter={PodConditionsPresenter}
          />
        </Col>
        <Col lg={8}>
          <Card title="Container Status" useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
