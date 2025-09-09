/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import {
  kiloBytesTwoDecimalPlaces,
  percentage,
  bytesPerSecondZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error needs migration
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
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

export default function Summary({ timeConfig, data: vm }: SummaryData) {
  const snapshotId = vm.id;
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-linux-kvm-hypervisor:dashboards.vmName')} value={vm.name || 'N/A'} />
        <KpiCard title={t('in-linux-kvm-hypervisor:dashboards.os')} value={vm.os || 'N/A'} />
        <KpiCard title={t('in-linux-kvm-hypervisor:dashboards.vmState')} value={vm.state || 'N/A'} />
        <KpiCard title={t('in-linux-kvm-hypervisor:dashboards.virtualCpuCount')} value={vm.numberOfVCpus || 'N/A'} />
      </KpiGridRow>
      <KpiGridRow sizes={[6, 6]}>
        <InfraMetricKpiCard
          title={t('in-linux-kvm-hypervisor:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsageRatio"
          formatter={percentage.compact}
        />
        <InfraMetricKpiCard
          title={t('in-linux-kvm-hypervisor:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="memoryUsageRatio"
          formatter={percentage.compact}
        />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-linux-kvm-hypervisor:dashboards.cpuUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.compact,
                metrics: ['cpuUsageRatio'],
                labels: [t('in-linux-kvm-hypervisor:dashboards.total')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-linux-kvm-hypervisor:dashboards.memoryUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: kiloBytesTwoDecimalPlaces,
                metrics: ['memoryTotal', 'memoryUsage', 'memoryFree'],
                labels: [
                  t('in-linux-kvm-hypervisor:dashboards.total'),
                  t('in-linux-kvm-hypervisor:dashboards.used'),
                  t('in-linux-kvm-hypervisor:dashboards.free')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-linux-kvm-hypervisor:dashboards.networkUsage')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesPerSecondZeroDecimalPlaces,
                metrics: ['bytesRx', 'bytesTx', 'bytesTxRxTotal'],
                labels: [
                  t('in-linux-kvm-hypervisor:dashboards.bytesRX'),
                  t('in-linux-kvm-hypervisor:dashboards.bytesTX'),
                  t('in-linux-kvm-hypervisor:dashboards.total')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-linux-kvm-hypervisor:dashboards.networkError')} useMaxAvailableHeight>
            <InfrastructureMetricChart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['networkTxDropCount', 'networkTxErrorCount', 'networkRxDropCount', 'networkRxErrorCount'],
                labels: [
                  t('in-linux-kvm-hypervisor:dashboards.txDrop'),
                  t('in-linux-kvm-hypervisor:dashboards.txError'),
                  t('in-linux-kvm-hypervisor:dashboards.rxDrop'),
                  t('in-linux-kvm-hypervisor:dashboards.rxError')
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
