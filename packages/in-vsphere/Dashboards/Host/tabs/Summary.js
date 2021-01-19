/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { number, bytesZeroDecimalPlaces, percentage, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import Card from 'in-new-components/Card';
import theme from 'in-themes';
import DatastoreTable from './DatastoreTable';

export default function Summary({ timeConfig, data: host }) {
  const snapshotId = host.id;
  const { lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title="CPU Usage"
          snapshotId={snapshotId}
          metric="cpu.usage.percent.maximum.*"
          formatter={percentage.detailed}
        />
        <KpiCard
          title="CPU Total"
          value={<Capitalize>{host.cpuTotal || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title="Memory Usage"
          snapshotId={snapshotId}
          metric="mem.usage.average.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title="Memory Total"
          value={<Capitalize>{bytesTwoDecimalPlaces(host.memoryTotal) || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title="CPU" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['cpu.usage.percent.maximum.*'],
                labels: ['Usage'],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Memory" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['mem.active.bytes.average', 'mem.shared.bytes.average', 'mem.vmmemctl.bytes.average'],
                labels: ['Active', 'Shared', 'Vmemctl'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title="Network" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                metrics: [
                  'net.received.average.bytesPerSecond',
                  'net.transmitted.average.bytesPerSecond',
                  'net.total.average.bytesPerSecond'
                ],
                labels: ['Bytes Received', 'Bytes Transmitted', 'Bytes Total'],
                type: 'line'
              }}
              y2={{
                formatter: number.compact,
                metrics: [
                  'net.packetsRx.summation.number',
                  'net.packetsTx.summation.number',
                  'net.packetsTotal.summation.number'
                ],
                labels: ['Packets Received', 'Packets Transmitted', 'Packets Total'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <DatastoreTable data={host} timeConfig={timeConfig} />
    </Fragment>
  );
}
