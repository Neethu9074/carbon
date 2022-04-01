/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: hypervisor }) {
  const snapshotId = hypervisor.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3]}>
        <InfraMetricKpiCard
          title={t('in-openstack:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsage"
          formatter={percentage.detailed}
        />

        <InfraMetricKpiCard
          title={t('in-openstack:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="memoryUsage"
          formatter={percentage.detailed}
        />
      </KpiGridRow>
      <Row>
        <Col lg={6}>
          <Card title={t('in-openstack:dashboards.cpuResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpuUsage'],
                labels: [t('in-openstack:dashboards.cpuUsage')],
                formatter: percentage.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6} />
        <Col lg={6}>
          <Card title={t('in-openstack:dashboards.memoryResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['memoryUsage'],
                labels: [t('in-openstack:dashboards.memoryUsage')],
                formatter: percentage.compact,
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
