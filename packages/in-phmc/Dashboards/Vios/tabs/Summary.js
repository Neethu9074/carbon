/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { number, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vios }) {
  const snapshotId = vios.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[2, 2, 2, 2, 2, 2]}>
        <KpiCard title={t('in-phmc:partitionId')} value={vios.partitionId || valueMissingPlaceholder} raw borderless />
        <KpiCard title={t('in-phmc:dashboards.name')} value={vios.name || valueMissingPlaceholder} raw borderless />
        <KpiCard title={t('in-phmc:state')} value={vios.state || valueMissingPlaceholder} raw borderless />
        <KpiCard title={t('in-phmc:mode')} value={vios.mode || valueMissingPlaceholder} raw borderless />
        <InfraMetricKpiCard
          title={t('in-phmc:utilizedMem')}
          snapshotId={snapshotId}
          metric="utilizedMemPercentage"
          formatter={percentage.detailed}
        />
        <InfraMetricKpiCard
          title={t('in-phmc:entitledProc')}
          snapshotId={snapshotId}
          metric="entitledProcUnitsPercentage"
          formatter={percentage.detailed}
        />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.processorUnits')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['utilizedProcUnits', 'maxProcUnits', 'entitledProcUnits'],
                labels: [t('in-phmc:utilized'), t('in-phmc:max'), t('in-phmc:entitled')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-phmc:entitledProc')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['entitledProcUnitsPercentage'],
                labels: [t('in-phmc:entitledPercent')],
                type: 'line',
                formatter: percentage.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.maxCpuUtilzation')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['maxCPUCapacityUtilisation'],
                labels: [t('in-phmc:maxCpuUtilzation')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-phmc:dashboards.memoryUsage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['utilizedMem', 'assignedMem'],
                labels: [t('in-phmc:utilized'), t('in-phmc:assigned')],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                metrics: ['utilizedMemPercentage'],
                labels: [t('in-phmc:utilizedPercent')],
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
