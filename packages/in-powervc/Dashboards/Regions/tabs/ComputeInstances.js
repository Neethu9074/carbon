/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { kiloBytes, number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: region }) {
  const snapshotId = region.id;

  return (
    <Fragment>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.cpuUsageAll')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpuUsage'],
                labels: [t('in-powervc:cpuUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.memoryUsageAll')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['memoryUsage'],
                labels: [t('in-powervc:memoryUsage')],
                formatter: kiloBytes.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        </Row>
        <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.storageUsageAll')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['storageUsage'],
                labels: [t('in-powervc:storageUsage')],
                formatter: kiloBytes.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        </Row>
    </Fragment>
  );
}
