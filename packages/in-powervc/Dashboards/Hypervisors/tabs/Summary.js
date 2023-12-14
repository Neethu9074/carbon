/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, bytes } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: hypervisor }) {
  const snapshotId = hypervisor.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[2, 2, 2, 2, 2, 2]}>
        <KpiCard title={t('in-powervc:id')} value={hypervisor.itemId} raw borderless />
        <KpiCard title={t('in-powervc:cpuArch')} value={hypervisor.powervcItem.architecture} raw borderless />
        <KpiCard title={t('in-powervc:cpuModel')} value={hypervisor.powervcItem.model} raw borderless />
        <KpiCard title={t('in-powervc:cpuVendor')} value={hypervisor.powervcItem.vendor} raw borderless />
        <KpiCard title={t('in-powervc:status')} value={hypervisor.powervcItem.status} raw borderless />
        {hypervisor.powervcItem.cores != 0 ? (
          <KpiCard title={t('in-powervc:cpuCores')} value={hypervisor.powervcItem.cores} raw borderless />
        ) : null}
      </KpiGridRow>
      <KpiGridRow sizes={[2, 2, 2, 2]}>
        <KpiCard title={t('in-powervc:state')} value={hypervisor.powervcItem.state} raw borderless />
        <KpiCard title={t('in-powervc:hostIP')} value={hypervisor.powervcItem.hostIP} raw borderless />
        <KpiCard title={t('in-powervc:hypervisorType')} value={hypervisor.powervcItem.type} raw borderless />
        <KpiCard title={t('in-powervc:hypervisorVersion')} value={hypervisor.powervcItem.version} raw borderless />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.cpuResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpuUsage'],
                labels: [t('in-powervc:dashboards.cpuUsage')],
                formatter: percentage.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.memoryResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['memoryUsage'],
                labels: [t('in-powervc:dashboards.memoryUsage')],
                formatter: percentage.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.instanceCount')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['instanceCount'],
                labels: [t('in-powervc:instanceCount')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.storage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['storageUsage'],
                labels: [t('in-powervc:storage')],
                formatter: bytes.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-powervc:dashboards.currentWorkload')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['currentWorkload'],
                labels: [t('in-powervc:currentWorkload')],
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
