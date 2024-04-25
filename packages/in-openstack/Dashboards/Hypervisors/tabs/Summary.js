/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: hypervisor }) {
  const snapshotId = hypervisor.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[2, 2, 2, 2, 2, 2]}>
        <KpiCard title={t('in-openstack:id')} value={hypervisor.openstackItem.id} raw borderless />
        <KpiCard title={t('in-openstack:cpuArch')} value={hypervisor.openstackItem.architecture} raw borderless />
        <KpiCard title={t('in-openstack:cpuModel')} value={hypervisor.openstackItem.model} raw borderless />
        <KpiCard title={t('in-openstack:cpuVendor')} value={hypervisor.openstackItem.vendor} raw borderless />
        <KpiCard title={t('in-openstack:cpuCores')} value={hypervisor.openstackItem.cores} raw borderless />
        <KpiCard title={t('in-openstack:status')} value={hypervisor.openstackItem.status} raw borderless />
      </KpiGridRow>
      <KpiGridRow sizes={[2, 2, 2, 2]}>
        <KpiCard title={t('in-openstack:state')} value={hypervisor.openstackItem.state} raw borderless />
        <KpiCard title={t('in-openstack:hostIP')} value={hypervisor.openstackItem.hostIP} raw borderless />
        <KpiCard title={t('in-openstack:hypervisorType')} value={hypervisor.openstackItem.type} raw borderless />
        <KpiCard title={t('in-openstack:hypervisorVersion')} value={hypervisor.openstackItem.version} raw borderless />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-openstack:dashboards.cpuResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpuUsage','cpuResources'],
                labels: [t('in-openstack:dashboards.cpuUsage'),t('in-openstack:totalCpu')],
                formatter: number.compact,
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
                metrics: ['memoryUsage','memoryResources'],
                labels: [t('in-openstack:dashboards.memoryUsage'),t('in-openstack:totalMemory')],
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
          <Card title={t('in-openstack:dashboards.instanceCount')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['instanceCount'],
                labels: [t('in-openstack:instanceCount')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-openstack:dashboards.storage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['storageUsage','storageResources'],
                labels: [t('in-openstack:storageUsage'),t('in-openstack:totalStorage')],
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
          <Card title={t('in-openstack:dashboards.currentWorkload')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['currentWorkload'],
                labels: [t('in-openstack:currentWorkload')],
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
