/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { number, bytes, percentage, bytesTwoDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title="CPU Usage"
          snapshotId={snapshotId}
          metric="cpu.usage.maximum.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title="CPU Total"
          value={<Capitalize>{vm.cpuTotal || valueMissingPlaceholder}</Capitalize>}
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
          value={<Capitalize>{bytesTwoDecimalPlaces(vm.memoryTotal) || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard
          title="Guest OS"
          value={<Capitalize>{vm.guestFullName || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title="State"
          value={<Capitalize>{vm.guestState || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title="CPU" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: msZeroDecimalPlaces,
                metrics: [
                  'cpu.system.summation.milliseconds',
                  'cpu.ready.summation.milliseconds',
                  'cpu.wait.summation.milliseconds'
                ],
                labels: ['System', 'Ready', 'Wait'],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['cpu.usage.maximum.percent', 'cpu.readiness.average.percent', 'cpu.latency.average.percent'],
                labels: ['Usage', 'Readiness', 'Latency'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title="Memory" useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: [
                  'mem.active.none.bytes',
                  'mem.swapped.none.bytes',
                  'mem.granted.none.bytes',
                  'mem.vmmemctl.none.bytes'
                ],
                labels: ['Active', 'Swapped', 'Granted', 'Vmemctl'],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['mem.usage.average.percent'],
                labels: ['Usage'],
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
                formatter: bytes.perSecond,
                metrics: [
                  'net.received.average.bytesPerSecond',
                  'net.transmitted.average.bytesPerSecond',
                  'net.bytestotal.average.bytesPerSecond'
                ],
                labels: ['Bytes received', 'Bytes transmitted', 'Total bytes'],
                type: 'line'
              }}
              y2={{
                formatter: number.compact,
                metrics: [
                  'net.packetsRx.summation.number',
                  'net.packetsTx.summation.number',
                  'net.packetsTotal.summation.number'
                ],
                labels: ['Packets received', 'Packets transmitted', 'Total packets'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
