/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import NetworkInterface from 'in-openstack/Dashboards/Instances/table/NetworkInterface';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InstanceUsage from 'in-openstack/Dashboards/Instances/table/InstanceUsage';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DiskDetails from 'in-openstack/Dashboards/Instances/table/DiskDetails';
import CpuDetails from 'in-openstack/Dashboards/Instances/table/CpuDetails';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { number, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: instance }) {
  const snapshotId = instance.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[2, 4, 2, 2, 2]}>
        <KpiCard title={t('in-openstack:name')} value={instance.name} raw borderless />
        <KpiCard title={t('in-openstack:hostName')} value={instance.openstackItem.host} raw borderless />
        <KpiCard
          title={t('in-openstack:availabilityZone')}
          value={instance.openstackItem.availabilityZone}
          raw
          borderless
        />
        <KpiCard title={t('in-openstack:hostIP')} value={instance.openstackItem.hostIP} raw borderless />
        <KpiCard title={t('in-openstack:flavorName')} value={instance.openstackItem.flavor} raw borderless />
      </KpiGridRow>
      <KpiGridRow sizes={[2, 2, 2, 2, 2]}>
        <KpiCard title={t('in-openstack:imageName')} value={instance.openstackItem.image} raw borderless />
        <InfraMetricKpiCard
          title={t('in-openstack:uptime')}
          snapshotId={snapshotId}
          metric="upTime"
          formatter={number.compact}
        />
        <KpiCard title={t('in-openstack:status')} value={instance.openstackItem.status} raw borderless />
      </KpiGridRow>
      <Row verticallyStretchColumns>
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
      <Row />
      <DiskDetails snapshotId={instance.id} timeConfig={timeConfig} />
      <InstanceUsage snapshotId={instance.id} timeConfig={timeConfig} />
      <CpuDetails snapshotId={instance.id} timeConfig={timeConfig} />
      <NetworkInterface data={instance} />
    </Fragment>
  );
}
