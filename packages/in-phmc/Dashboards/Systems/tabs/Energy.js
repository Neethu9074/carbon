/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import BaseboardTemperature from 'in-phmc/Dashboards/tables/BaseboardTemperature';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InletTemperature from 'in-phmc/Dashboards/tables/InletTemperature';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import CpuTemperature from 'in-phmc/Dashboards/tables/CpuTemperature';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Energy({ timeConfig, data: system }) {
  const snapshotId = system.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-phmc:powerConsumption')}
          snapshotId={snapshotId}
          metric="powerReading"
          formatter={number.compact}
        />
        <KpiCard title={t('in-phmc:machineTypeModel')} value={system.energy.machineTypeModel} raw borderless />
        <KpiCard title={t('in-phmc:machineSerial')} value={system.energy.machineSerial} raw borderless />
        <KpiCard title={t('in-phmc:sampleType')} value={system.energy.sampleType} raw borderless />
      </KpiGridRow>
      <KpiGridRow sizes={[4]}>
        <KpiCard title={t('in-phmc:uuid')} value={system.energy.uuid} raw borderless />
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-phmc:powerUtilization')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['powerReading'],
                labels: [t('in-phmc:powerConsumption')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <InletTemperature snapshotId={system.id} timeConfig={timeConfig} />
      <CpuTemperature snapshotId={system.id} timeConfig={timeConfig} />
      <BaseboardTemperature snapshotId={system.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
