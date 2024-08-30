/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import SharedProcessorPool from 'in-phmc/Dashboards/tables/SharedProcessorPool';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
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
                metrics: ['utilizedProcUnits', 'availableProcUnits', 'configurableProcUnits'],
                labels: [t('in-phmc:utilized'), t('in-phmc:available'), t('in-phmc:configurable')],
                formatter: number.detailed,
                type: 'line'
              }}
              y2={{
                min: 0,
                metrics: ['utilizedProcUnitsPercent', 'availableProcUnitsPercent', 'configurableProcUnitsPercent'],
                labels: [t('in-phmc:utilizedProc'), t('in-phmc:availableProc'), t('in-phmc:configurableProc')],
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
                metrics: ['availableMem', 'configurableMem', 'assignedMemToLpars'],
                labels: [t('in-phmc:available'), t('in-phmc:configurable'), t('in-phmc:assignedMem')],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                min: 0,
                metrics: ['availableMemPercentage', 'configurableMemPercentage', 'assignedMemToLparsPercentage'],
                labels: [
                  t('in-phmc:availablePercentage'),
                  t('in-phmc:configurablePercentage'),
                  t('in-phmc:assignedMemPercentage')
                ],
                formatter: percentage.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.systemFirmwareUtilized')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['utilizedProcUnitsHypervisor'],
                labels: [t('in-phmc:utilizedProcNumber')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.systemFirmwareAssignedMem')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['assignedMemHypervisor'],
                labels: [t('in-phmc:assignedMemory')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Card title={t('in-phmc:dashboards.sharedProcessorPool')}>
        <SharedProcessorPool timeConfig={timeConfig} system={system} />
      </Card>
    </Fragment>
  );
}
