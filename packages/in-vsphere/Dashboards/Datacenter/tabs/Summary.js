import React, { Fragment } from 'react';

import { timeBySecondsTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
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
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard
          title="Overall Status"
          value={<Capitalize>{cluster.overallStatus || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title="Uptime in seconds"
          snapshotId={snapshotId}
          metric="uptime.seconds"
          formatter={timeBySecondsTwoDecimalPlaces}
        />
      </KpiGridRow>
      <Row>
        <Col lg={6}>
          <InfraMetricKpiCard
            title="CPU Usage"
            snapshotId={snapshotId}
            metric="cpu.usage.percent.maximum.*"
            formatter={d => zeroDecimalPlaces(d / 10) + '%'}
          />
        </Col>
        <Col lg={6}>
          <InfraMetricKpiCard
            title="Memory Usage"
            snapshotId={snapshotId}
            metric="mem.usage.average.percent"
            formatter={d => zeroDecimalPlaces(d / 100) + '%'}
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
                formatter: d => zeroDecimalPlaces(d / 10) + '%',
                metrics: ['cpu.usage.percent.maximum.*', 'cpuAllocation'].filter(Boolean),
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
                formatter: d => zeroDecimalPlaces(d / 100) + '%',
                metrics: ['mem.usage.average.percent', 'memoryAllocation'].filter(Boolean),
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
