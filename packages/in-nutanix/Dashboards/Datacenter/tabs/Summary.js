/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { bytes, millis, percentage } from 'in-services/formatters/number';
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
          title={t('in-nutanix:operationMode')}
          value={cluster.operationMode}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsage"
          formatter={percentage.detailed}
        />
        <InfraMetricKpiCard
          title={t('in-nutanix:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="memoryUsage"
          formatter={percentage.detailed}
        />
      </KpiGridRow>

      <KpiGridRow sizes={[6, 6]}>
        <KpiCard
          title={t('in-nutanix:hypervisorTypes')}
          value={cluster.hypervisorTypes}
          renderValue={capitalizeValue}
          raw
          borderless
        />
        <KpiCard
          title={t('in-nutanix:clusterArch')}
          value={cluster.clusterArch}
          renderValue={capitalizeValue}
          raw
          borderless
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.memoryUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['memoryUsage'],
                labels: [t('in-nutanix:dashboards.memoryUsage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.cpuUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['cpuUsage'],
                labels: [t('in-nutanix:dashboards.cpuUsage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.contentCacheLookups')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['contentCacheLookups'],
                labels: [t('in-nutanix:dashboards.contentCacheLookups')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.totalIoSizeBytes')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes,
                metrics: ['totalIoSizeBytes'],
                labels: [t('in-nutanix:dashboards.totalIoSizeBytes')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.contentCacheMemoryUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes,
                metrics: ['contentCacheMemoryUsage'],
                labels: [t('in-nutanix:dashboards.contentCacheMemoryUsage')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.contentCacheHitPpm')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['contentCacheHitPpm'],
                labels: [t('in-nutanix:dashboards.contentCacheHitPpm')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.ioOps')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['controllerReadIops', 'controllerWriteIops'],
                labels: [t('in-nutanix:dashboards.ioReads'), t('in-nutanix:dashboards.ioWrites')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-nutanix:dashboards.ioLatency')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: millis,
                metrics: ['datacenterAverageIoLatency'],
                labels: [t('in-nutanix:dashboards.averageIoLatency')],
                type: 'line',
                colors: [usage]
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
