import React, { Fragment } from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

export default function Summary({ timeConfig, data: cluster }) {
  const snapshotId = cluster.id;
  const { teal800: allocated, lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title="Overall Status"
          value={<Capitalize>{cluster.overallStatus || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard title="ESXi hosts" value={cluster.hosts} raw borderless />
        <KpiCard title="Virtual machines" value={cluster.vms} raw borderless />
        <EntityHealthIndicator
          openIssues={cluster.entityHealthInfo.openIssues.length}
          maxSeverity={cluster.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={snapshotId}
        />
      </KpiGridRow>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="CPU Usage"
            snapshotId={snapshotId}
            metric="cpuUsage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="CPU Alloc."
            snapshotId={snapshotId}
            metric="cpuAllocation"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Usage"
            snapshotId={snapshotId}
            metric="memoryUsage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title="Memory Alloc."
            snapshotId={snapshotId}
            metric="memoryAllocation"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title="CPU Resources" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['cpuUsage', 'cpuAllocation'].filter(Boolean),
                labels: ['Usage', 'Allocation'].filter(Boolean),
                type: 'line',
                colors: [usage, allocated]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Memory Resources" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['memoryUsage', 'memoryAllocation'].filter(Boolean),
                labels: ['Usage', 'Allocation'].filter(Boolean),
                type: 'line',
                colors: [usage, allocated]
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
