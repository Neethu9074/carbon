/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, millis, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function Instance({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Document Count">
          <MetricValue snapshotId={snapshotId} metric="metrics.instance.dc" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Service Availability">
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.instance.sa"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Instance metrics">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.tr'],
            labels: ['Total Requests'],
            type: 'line'
          }}
          y2={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.mr'],
            labels: ['Metadata Requests'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.detaileds,
            metrics: ['metrics.instance.rl'],
            labels: ['Read Latency'],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            metrics: ['metrics.instance.wl'],
            labels: ['Write Latency'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
