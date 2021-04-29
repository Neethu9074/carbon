/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React, { Fragment } from 'react';

import { number, bytes, percentage, bytesTwoDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-vsphere:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpu.usage.maximum.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-vsphere:dashboards.cpuTotal')}
          value={<Capitalize>{vm.cpuTotal || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title={t('in-vsphere:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="mem.usage.average.percent"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-vsphere:dashboards.memoryTotal')}
          value={<Capitalize>{bytesTwoDecimalPlaces(vm.memoryTotal) || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard
          title={t('in-vsphere:dashboards.guestOs')}
          value={<Capitalize>{vm.guestFullName || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
        <KpiCard
          title={t('in-vsphere:dashboards.state')}
          value={<Capitalize>{vm.guestState || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-vsphere:dashboards.cpu')} useMaxAvailableHeight>
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
                labels: [
                  t('in-vsphere:dashboards.system'),
                  t('in-vsphere:dashboards.ready'),
                  t('in-vsphere:dashboards.wait')
                ],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['cpu.usage.maximum.percent', 'cpu.readiness.average.percent', 'cpu.latency.average.percent'],
                labels: [
                  t('in-vsphere:dashboards.usage'),
                  t('in-vsphere:dashboards.readiness'),
                  t('in-vsphere:dashboards.latency')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-vsphere:dashboards.memory')} useMaxAvailableHeight>
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
                  t('in-vsphere:dashboards.active'),
                  t('in-vsphere:dashboards.swapped'),
                  t('in-vsphere:dashboards.granted'),
                  t('in-vsphere:dashboards.vmemctl')
                ],
                type: 'line'
              }}
              y2={{
                formatter: percentage.detailed,
                metrics: ['mem.usage.average.percent'],
                labels: [t('in-vsphere:dashboards.usage')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-vsphere:dashboards.network')} useMaxAvailableHeight>
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
                  t('in-vsphere:dashboards.vm.bytesReceived'),
                  t('in-vsphere:dashboards.vm.bytesTransmitted'),
                  t('in-vsphere:dashboards.vm.totalBytes')
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
                  t('in-vsphere:dashboards.vm.packetsReceived'),
                  t('in-vsphere:dashboards.vm.packetsTransmitted'),
                  t('in-vsphere:dashboards.vm.totalPackets')
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
