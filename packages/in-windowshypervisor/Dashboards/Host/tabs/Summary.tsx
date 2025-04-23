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
import { number, kiloBytesTwoDecimalPlaces, megaBytesTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricChart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export interface SummaryData {
  timeConfig: TimeConfig;
  data: SnapshotData;
}

export default function Summary({ timeConfig, data: host }: SummaryData) {
  const snapshotId = host.id;
  return (
    <>
      <KpiGridRow sizes={[4, 2, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.os')} value={host.os} />
        <KpiCard title={t('in-windowshypervisor:dashboards.address')} value={host.address} />
        <KpiCard title={t('in-windowshypervisor:dashboards.processorCount')} value={host.cpuCount} />
        <InfraMetricKpiCard
          title={t('in-windowshypervisor:dashboards.freeRAM')}
          snapshotId={snapshotId}
          metric="freeRAM"
          formatter={megaBytesTwoDecimalPlaces}
        />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-windowshypervisor:dashboards.cpuAveragePercentage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.detailed,
                metrics: ['cpuAverage'],
                labels: [t('in-windowshypervisor:dashboards.cpuAverage')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-windowshypervisor:memoryUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['memoryTotalKib', 'memoryFreeKib'],
                labels: [
                  t('in-windowshypervisor:dashboards.memoryTotal'),
                  t('in-windowshypervisor:dashboards.memoryFree')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
