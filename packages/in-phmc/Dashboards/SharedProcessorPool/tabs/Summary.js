/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sharedProcessorPool }) {
  const snapshotId = sharedProcessorPool.id;
  return (
    <Fragment>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.processorUnits')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'totalEntitledProcUnits',
                  'utilizedProcUnits',
                  'availableProcUnits',
                  'currentReservedProcUnits'
                ],
                labels: [
                  t('in-phmc:entitled'),
                  t('in-phmc:utilized'),
                  t('in-phmc:available'),
                  t('in-phmc:reservedProc')
                ],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.processorUnitsPercent')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['utilizedProcUnitsPercent', 'availableProcUnitsPercent','entitledProcUnitsUsedPercent'],
                labels: [t('in-phmc:utilized'), t('in-phmc:available'), t('in-phmc:entitledUsed')],
                type: 'line',
                formatter: percentage.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
