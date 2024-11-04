/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import { number, bytes, percentage, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { capitalizeValue } from 'in-components/Capitalize';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpu.usage.maximum.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-nutanix:dashboards.cpuTotal')}
          value={vm.cpuTotal}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="mem.usage.average.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-nutanix:dashboards.memoryTotal')}
          value={vm.memoryTotal}
          metric="mem.usage.average.percent"
          formatter={percentage.detailed}
        />
      </KpiGridRow>
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard title={t('in-nutanix:dashboards.guestOs')} value={vm.guestFullName} raw borderless />
        <KpiCard
          title={t('in-nutanix:dashboards.state')}
          value={vm.guestState}
          renderValue={capitalizeValue}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-nutanix:dashboards.cpu')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: millis,
                metrics: [
                  'cpu.system.summation.milliseconds',
                  'cpu.ready.summation.milliseconds',
                  'cpu.wait.summation.milliseconds'
                ],
                labels: [
                  t('in-nutanix:dashboards.system'),
                  t('in-nutanix:dashboards.ready'),
                  t('in-nutanix:dashboards.wait')
                ],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['cpu.usage.maximum.percent', 'cpu.readiness.average.percent', 'cpu.latency.average.percent'],
                labels: [
                  t('in-nutanix:dashboards.usage'),
                  t('in-nutanix:dashboards.readiness'),
                  t('in-nutanix:dashboards.latency')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-nutanix:dashboards.memory')} useMaxAvailableHeight>
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
                labels: [
                  t('in-nutanix:dashboards.active'),
                  t('in-nutanix:dashboards.swapped'),
                  t('in-nutanix:dashboards.granted'),
                  t('in-nutanix:dashboards.vmemctl')
                ],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['mem.usage.average.percent'],
                labels: [t('in-nutanix:dashboards.usage')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-nutanix:dashboards.network')} useMaxAvailableHeight>
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
                labels: [
                  t('in-nutanix:dashboards.vm.bytesReceived'),
                  t('in-nutanix:dashboards.vm.bytesTransmitted'),
                  t('in-nutanix:dashboards.vm.totalBytes')
                ],
                type: 'line'
              }}
              y2={{
                formatter: number.compact,
                metrics: [
                  'net.packetsRx.summation.number',
                  'net.packetsTx.summation.number',
                  'net.packetsTotal.summation.number'
                ],
                labels: [
                  t('in-nutanix:dashboards.vm.packetsReceived'),
                  t('in-nutanix:dashboards.vm.packetsTransmitted'),
                  t('in-nutanix:dashboards.vm.totalPackets')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
