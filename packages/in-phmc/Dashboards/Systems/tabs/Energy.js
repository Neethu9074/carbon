/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import SharedProcessorPool from 'in-phmc/Dashboards/tables/SharedProcessorPool';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: system }) {
  const snapshotId = system.id;
  return (
    <Fragment>
        <KpiGridRow sizes={[2, 2, 2, 2, 2, 2]}>
          <KpiCard title={'UUID'} value={231} raw borderless />
          <KpiCard title={'Power Consumption'} value={7262} raw borderless />
          <KpiCard title={'Machine Type'} value={'Abcd*bw'} raw borderless />
          <KpiCard title={'Model'} value={'XYZ'} raw borderless />
          <KpiCard title={'Serial number'} value={'snksmsd'} raw borderless />
          <KpiCard title={'Sample Type'} value={'qwerty'} raw borderless />

      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={'Power Utilization'} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['utilizedProcUnits'],
                labels: ['Power'],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <SharedProcessorPool snapshotId={system.id} />
    </Fragment>
  );
}
