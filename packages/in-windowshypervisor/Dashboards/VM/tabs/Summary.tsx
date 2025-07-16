/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error needs migration
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import InfrastructureMetricChart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { kiloBytesTwoDecimalPlaces, kiloBytes, percentage } from 'in-services/formatters/number';
import DisksTable from 'in-windowshypervisor/Dashboards/VM/tabs/StorageDiskTable';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Capitalize from 'in-components/Capitalize';
import { t } from 'in-i18n';

export interface SummaryData {
  timeConfig: TimeConfig;
  data: SnapshotData;
}

export default function Summary({ timeConfig, data: vm }: SummaryData) {
  const snapshotId = vm.id;
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.macAddress')}>
          <Capitalize>{vm.macAddress || 'N/A'}</Capitalize>
        </KpiCard>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.ramAssigned')}>
          <Capitalize>{vm.memoryAssigned || 'N/A'}</Capitalize>
        </KpiCard>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.status')}>
          <Capitalize>{vm.status || 'N/A'}</Capitalize>
        </KpiCard>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.state')}>
          <Capitalize>{vm.state || 'N/A'}</Capitalize>
        </KpiCard>
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.switchName')}>
          <Capitalize>{vm.switchName || 'N/A'}</Capitalize>
        </KpiCard>
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:dashboards.vm.totalDiskStorage')}
          snapshotId={snapshotId}
          metric="totalDiskStorage"
          formatter={kiloBytesTwoDecimalPlaces}
        />
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:cpuUsage')}
          snapshotId={snapshotId}
          metric="vmCpuUsage"
          formatter={percentage.detailed}
        />
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.upTime')}>
          <Capitalize>{vm.upTime || 'N/A'}</Capitalize>
        </KpiCard>
      </KpiGridRow>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-windowshypervisor:dashboards.vm.performanceMetrics')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['avgCPU', 'avgRAM'],
                labels: [t('in-windowshypervisor:dashboards.vm.cpu'), t('in-windowshypervisor:dashboards.vm.ram')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-windowshypervisor:dashboards.vm.networkMetrics')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytes.detailed,
                metrics: ['networkInbound', 'networkOutbound'],
                labels: [
                  t('in-windowshypervisor:dashboards.vm.networkInboundBytes'),
                  t('in-windowshypervisor:dashboards.vm.networkOutboundBytes')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <DisksTable data={vm} timeConfig={timeConfig} />
    </>
  );
}
