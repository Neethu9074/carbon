/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: region }) {
  const snapshotId = region.id;

  return (
    <Fragment>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalCoresUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalCoresUsed'],
                labels: [t('in-powervc:coresUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalInstancesUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpuUsage'],
                labels: [t('in-powervc:instanceUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        </Row>
        <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalRAMUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalRAMUsed'],
                labels: [t('in-powervc:ramUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalServerGroupsUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalServerGroupsUsed'],
                labels: [t('in-powervc:serverGroupsUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        </Row>
        <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalFloatingIpsUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalFloatingIpsUsed'],
                labels: [t('in-powervc:floatingIpsUsage')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.totalSecurityGroupsUsed')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalSecurityGroupsUsed'],
                labels: [t('in-powervc:securityGroupsUsage')],
                formatter: number.compact,
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
