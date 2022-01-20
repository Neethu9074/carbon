/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InletTemperature from 'in-phmc/Dashboards/tables/InletTemperature';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: system }) {
  const snapshotId = system.id;
  return (
    <Fragment>
        <KpiGridRow sizes={[2, 2, 2, 2, 2, 2]}>
          <KpiCard title={ t('in-phmc:uuid')} value={231} raw borderless />
          <KpiCard title={t('in-phmc:powerConsumption')} value={7262} raw borderless />
          <KpiCard title={t('in-phmc:machineType')} value={'Abcd*bw'} raw borderless />
          <KpiCard title={t('in-phmc:model')} value={'XYZ'} raw borderless />
          <KpiCard title={t('in-phmc:serialNumber')} value={'snksmsd'} raw borderless />
          <KpiCard title={t('in-phmc:sampleType')} value={'qwerty'} raw borderless />

      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-phmc:powerUtilization')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['utilizedProcUnits'],
                labels: [t('in-phmc:powerConsumption')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <InletTemperature snapshotId={system.id} timeConfig={timeConfig}/>
    </Fragment>
  );
}
