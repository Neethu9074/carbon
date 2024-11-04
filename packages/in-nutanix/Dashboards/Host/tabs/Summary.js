/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { Card } from '@instana/components';

import { number, bytesZeroDecimalPlaces, percentage, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { capitalizeValue } from 'in-components/Capitalize';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import DatastoreTable from './DatastoreTable';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: host }) {
  const snapshotId = host.id;
  const usage = themes.default.ids.color.option.blue['400'];

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsage"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-nutanix:dashboards.cpuTotal')}
          value={host.cpuTotal}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="memoryUsage"
          formatter={percentage.detailed}
        />
        <KpiCard
          title={t('in-nutanix:dashboards.memoryTotal')}
          value={host.memoryTotal}
          renderValue={value => capitalizeValue(bytesTwoDecimalPlaces(value))}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.cpu')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['cpuUsage'],
                labels: [t('in-nutanix:dashboards.usage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.memory')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['mem.active.bytes.average', 'mem.shared.bytes.average', 'mem.vmmemctl.bytes.average'],
                labels: [
                  t('in-nutanix:dashboards.active'),
                  t('in-nutanix:dashboards.shared'),
                  t('in-nutanix:dashboards.vmemctl')
                ],
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
                formatter: bytesZeroDecimalPlaces,
                metrics: [
                  'net.received.average.bytesPerSecond',
                  'net.transmitted.average.bytesPerSecond',
                  'net.total.average.bytesPerSecond'
                ],
                labels: [
                  t('in-nutanix:dashboards.host.bytesReceived'),
                  t('in-nutanix:dashboards.host.bytesTransmitted'),
                  t('in-nutanix:dashboards.host.bytesTotal')
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
                  t('in-nutanix:dashboards.host.packetsReceived'),
                  t('in-nutanix:dashboards.host.packetsTransmitted'),
                  t('in-nutanix:dashboards.host.packetsTotal')
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
