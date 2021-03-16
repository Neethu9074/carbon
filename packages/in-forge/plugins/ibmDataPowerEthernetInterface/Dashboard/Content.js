/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmDataPowerEthernetInterfaceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerEthernetInterface.receivedThroughput')}>
          <MetricValue snapshotId={snapshotId} metric="receivedPerSecond" formatter={zeroDecimalPlacesPerSecond} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerEthernetInterface.transmitThroughput')}>
          <MetricValue snapshotId={snapshotId} metric="transmitPerSecond" formatter={zeroDecimalPlacesPerSecond} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerEthernetInterface.throughput')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlacesPerSecond,
            tooltipFormatter: zeroDecimalPlacesPerSecond,
            metrics: ['receivedPerSecond', 'transmitPerSecond'],
            labels: [
              t('in-forge:plugins.ibmDataPowerEthernetInterface.receivedPerSecond'),
              t('in-forge:plugins.ibmDataPowerEthernetInterface.transmitPerSecond')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
