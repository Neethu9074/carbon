/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import { number, bytesZeroDecimalPlaces, percentage, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Capitalize from 'in-new-components/Capitalize';
import { Row, Col } from 'in-components/layout/Grid';
import DatastoreTable from './DatastoreTable';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: host }) {
  const snapshotId = host.id;
  const { lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-vsphere:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpu.usage.percent.maximum.*"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-vsphere:dashboards.cpuTotal')}
          value={<Capitalize>{host.cpuTotal || valueMissingPlaceholder}</Capitalize>}
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
          value={<Capitalize>{bytesTwoDecimalPlaces(host.memoryTotal) || valueMissingPlaceholder}</Capitalize>}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-vsphere:dashboards.cpu')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['cpu.usage.percent.maximum.*'],
                labels: [t('in-vsphere:dashboards.usage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-vsphere:dashboards.memory')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['mem.active.bytes.average', 'mem.shared.bytes.average', 'mem.vmmemctl.bytes.average'],
                labels: [
                  t('in-vsphere:dashboards.active'),
                  t('in-vsphere:dashboards.shared'),
                  t('in-vsphere:dashboards.vmemctl')
                ],
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
                formatter: bytesZeroDecimalPlaces,
                metrics: [
                  'net.received.average.bytesPerSecond',
                  'net.transmitted.average.bytesPerSecond',
                  'net.total.average.bytesPerSecond'
                ],
                labels: [
                  t('in-vsphere:dashboards.host.bytesReceived'),
                  t('in-vsphere:dashboards.host.bytesTransmitted'),
                  t('in-vsphere:dashboards.host.bytesTotal')
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
                  t('in-vsphere:dashboards.host.packetsReceived'),
                  t('in-vsphere:dashboards.host.packetsTransmitted'),
                  t('in-vsphere:dashboards.host.packetsTotal')
                ],
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
