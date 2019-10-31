import React, { Fragment } from 'react';

import {
  timeBySecondsTwoDecimalPlaces,
  twoDecimalPlaces,
  zeroDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

const kbPerSecondFormatter = v => zeroDecimalPlaces(v) + ' KB/s';

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
          title="Uptime"
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
            formatter={d => twoDecimalPlaces(d / 100) + '%'}
          />
        </Col>
        <Col lg={6}>
          <InfraMetricKpiCard
            title="Memory Usage"
            snapshotId={snapshotId}
            metric="mem.usage.average.percent"
            formatter={d => twoDecimalPlaces(d / 1000) + '%'}
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
                formatter: d => twoDecimalPlaces(d / 100) + '%',
                metrics: ['cpu.usage.percent.maximum.*'].filter(Boolean),
                labels: ['Usage'].filter(Boolean),
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
                formatter: d => twoDecimalPlaces(d / 1000) + '%',
                metrics: ['mem.usage.average.percent'].filter(Boolean),
                labels: ['Usage'].filter(Boolean),
                type: 'line',
                colors: [usage, allocated]
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title="VM balloon memory" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytesZeroDecimalPlaces,
                metrics: ['mem.vmmemctl.kiloBytes.average.*'].filter(Boolean),
                labels: ['VM balloon memory'].filter(Boolean),
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Net usage" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kbPerSecondFormatter,
                metrics: ['net.usage.kiloBytesPerSecond.none.*'].filter(Boolean),
                labels: ['Net usage'].filter(Boolean),
                type: 'line',
                colors: [usage, allocated]
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title="CPU" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: msZeroDecimalPlaces,
                metrics: ['cpu.wait.millisecond.summation.*', 'cpu.system.millisecond.summation.*'].filter(Boolean),
                labels: ['Wait', 'System'].filter(Boolean),
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
