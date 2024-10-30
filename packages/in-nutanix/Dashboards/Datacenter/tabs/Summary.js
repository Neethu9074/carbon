/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { Card } from '@instana/components';

import { bytesPerSecondZeroDecimalPlaces, millis, bytes, percentage } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { capitalizeValue } from 'in-components/Capitalize';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: cluster }) {
  const snapshotId = cluster.id;
  const usage = themes.default.ids.color.option.blue['400'];

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title={t('in-nutanix:dashboards.type')}
          value={cluster.type}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-nutanix:dashboards.hostsCount')}
          value={cluster.noOfHosts}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-nutanix:dashboards.cpuUsage')}
          value={cluster.cpuUsage}
          renderValue={percentage.detailed}
          raw
          borderless
        />
        <KpiCard
          title={t('in-nutanix:dashboards.memoryUsage')}
          value={cluster.memoryUsage}
          renderValue={percentage.detailed}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.cpuResources')} useMaxAvailableHeight>
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
          <Card title={t('in-nutanix:dashboards.memoryResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['memoryUsage'],
                labels: [t('in-nutanix:dashboards.usage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.vmBalloonMemory')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes.compact,
                metrics: ['mem.vmmemctl.bytes.average'],
                labels: [t('in-nutanix:dashboards.vmBalloonMemory')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.network')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesPerSecondZeroDecimalPlaces,
                metrics: ['net.usage.average.bytesPerSecond'],
                labels: [t('in-nutanix:dashboards.netUsage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-nutanix:dashboards.cpu')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.compact,
                metrics: ['cpu.wait.summation.milliseconds', 'cpu.system.summation.milliseconds'],
                labels: [t('in-nutanix:dashboards.wait'), t('in-nutanix:dashboards.system')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
