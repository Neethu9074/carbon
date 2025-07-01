/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import { number, bytesPerSecondTwoDecimalPlaces, kiloBytesTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricChart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import StorageRepositoryTable from 'in-xenserver/Dashboards/Host/tabs/StorageRepositoryTable';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
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
        <KpiCard title={t('in-xenserver:dashboards.address')} value={host.address} raw />
        <KpiCard title={t('in-xenserver:dashboards.cpuCount')} value={host.cpuCount} raw />
        <KpiCard title={t('in-xenserver:dashboards.poolSessionCount')} value={host.poolSessionCount} raw />
        <KpiCard title={t('in-xenserver:dashboards.poolTaskCount')} value={host.poolTaskCount} raw />
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-xenserver:dashboards.xapiMemoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="xapi_memory_usage_kib" formatter={kiloBytesTwoDecimalPlaces} />
        </KpiCard>
        <KpiCard title={t('in-xenserver:dashboards.xapiFreeMemory')}>
          <MetricValue snapshotId={snapshotId} metric="xapi_free_memory_kib" formatter={kiloBytesTwoDecimalPlaces} />
        </KpiCard>
        <KpiCard title={t('in-xenserver:dashboards.xapiLiveMemory')}>
          <MetricValue snapshotId={snapshotId} metric="xapi_live_memory_kib" formatter={kiloBytesTwoDecimalPlaces} />
        </KpiCard>
        <KpiCard title={t('in-xenserver:dashboards.xapiAllocation')}>
          <MetricValue snapshotId={snapshotId} metric="xapi_allocation_kib" formatter={kiloBytesTwoDecimalPlaces} />
        </KpiCard>
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-xenserver:dashboards.cpuAvg')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.detailed,
                metrics: ['cpu_avg'],
                labels: [t('in-xenserver:dashboards.cpuAvg')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-xenserver:dashboards.memoryUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['memory_total_kib', 'memory_free_kib'],
                labels: [t('in-xenserver:dashboards.memoryTotal'), t('in-xenserver:dashboards.memoryFree')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-xenserver:dashboards.network')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesPerSecondTwoDecimalPlaces,
                metrics: ['pif_aggr_rx', 'pif_aggr_tx'],
                labels: [t('in-xenserver:dashboards.bytesRx'), t('in-xenserver:dashboards.bytesTx')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <StorageRepositoryTable timeConfig={timeConfig} data={host} />
        </Col>
      </Row>
    </>
  );
}
