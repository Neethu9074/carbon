/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: system }) {
  const snapshotId = system.id;
  return (
    <Fragment>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-phmc:dashboards.processorUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalProcUnits', 'utilizedProcUnits', 'availableProcUnits', 'configurableProcUnits'],
                labels: [t('in-phmc:total'), t('in-phmc:utilized'), t('in-phmc:available'), t('in-phmc:configurable')],
                formatter: percentage.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card title={t('in-phmc:dashboards.memoryUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['totalMem', 'availableMem', 'configurableMem', 'assignedMemToLpars'],
                labels: [
                  t('in-phmc:total'),
                  t('in-phmc:available'),
                  t('in-phmc:configurable'),
                  t('in-phmc:assignedMem')
                ],
                formatter: number.detailed,
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
