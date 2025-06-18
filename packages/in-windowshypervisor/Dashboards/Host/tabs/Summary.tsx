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
import ProcessorStatsTable from 'in-windowshypervisor/Dashboards/Host/tabs/ProcessorStats';
import DatastoreTable from 'in-windowshypervisor/Dashboards/Host/tabs/StorageDiskTable';
import { kiloBytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
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

export default function Summary({ timeConfig, data: host }: SummaryData) {
  const snapshotId = host.id;
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.os')} value={host.os || 'N/A'} />
        <KpiCard title={t('in-windowshypervisor:dashboards.ipAddress')} value={host.address || 'N/A'} />
        <KpiCard title={t('in-windowshypervisor:dashboards.processorCount')} value={host.cpuCount || 'N/A'} />
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:dashboards.storageSpaceUsed')}
          snapshotId={snapshotId}
          metric="freeStorageSpace"
          formatter={kiloBytesTwoDecimalPlaces}
        />
      </KpiGridRow>

      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.macAddress')}>
          <Capitalize>{host.macAddress || 'N/A'}</Capitalize>
        </KpiCard>
        <KpiCard title={t('in-windowshypervisor:dashboards.upTime')}>
          <Capitalize>{host.upTime || 'N/A'}</Capitalize>
        </KpiCard>
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsage"
          formatter={percentage.detailed}
        />
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:memoryUsage')}
          snapshotId={snapshotId}
          metric="memoryUsage"
          formatter={percentage.detailed}
        />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-windowshypervisor:dashboards.cpuUsagePercentage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: ['logicalCpuUsage', 'virtualCpuUsage'],
                labels: [
                  t('in-windowshypervisor:dashboards.logicalCpuUsage'),
                  t('in-windowshypervisor:dashboards.virtualCpuUsage')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-windowshypervisor:dashboards.ram')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['totalRAM', 'freeRAM'],
                labels: [t('in-windowshypervisor:dashboards.totalRAM'), t('in-windowshypervisor:dashboards.freeRAM')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <DatastoreTable data={host} timeConfig={timeConfig} />
      <ProcessorStatsTable data={host} timeConfig={timeConfig} />
    </>
  );
}
