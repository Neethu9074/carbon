/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import VirtualNetworkInterfacesTable from 'in-xenserver/Dashboards/VM/tabs/VirtualNetworkInterfacesTable';
import InfrastructureMetricChart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { kiloBytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import BlockDeviceTable from 'in-xenserver/Dashboards/VM/tabs/BlockDeviceTable';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export interface SummaryData {
  timeConfig: TimeConfig;
  data: SnapshotData;
}

export default function Summary({ timeConfig, data: vm }: SummaryData) {
  const snapshotId = vm.id;
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3]}>
        <KpiCard title={t('in-xenserver:dashboards.vm.vcpu')} value={vm.vcpu} raw />
        <KpiCard title={t('in-xenserver:dashboards.vm.domId')} value={vm.domId} raw />
        <KpiCard title={t('in-xenserver:dashboards.vm.domType')} value={vm.domType} raw />
        <KpiCard title={t('in-xenserver:dashboards.vm.state')} value={vm.state} raw />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-xenserver:dashboards.cpuUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: percentage.compact,
                metrics: ['cpu_usage'],
                labels: [t('in-xenserver:dashboards.cpuUsage')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-xenserver:dashboards.memoryUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['memory'],
                labels: [t('in-xenserver:dashboards.memoryTotal')],
                type: 'line'
              }}
              y2={{
                min: 0,
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['memory_internal_free'],
                labels: [t('in-xenserver:dashboards.memoryFree')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <VirtualNetworkInterfacesTable timeConfig={timeConfig} data={vm} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <BlockDeviceTable timeConfig={timeConfig} data={vm} />
        </Col>
      </Row>
    </>
  );
}
