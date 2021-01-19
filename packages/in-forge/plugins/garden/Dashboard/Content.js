/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function GardenDashboard({ snapshot, timeConfig }) {
  const cpuLimit = snapshot.getIn(['data', 'cpu.limit']);
  const memoryLimit = snapshot.getIn(['data', 'memory.limit']);
  const diskLimitSoft = snapshot.getIn(['data', 'disk.byteSoft']);
  const diskLimitHard = snapshot.getIn(['data', 'disk.byteHard']);
  const diskLimit =
    diskLimitSoft || diskLimitHard
      ? '(Limit: ' +
        (diskLimitSoft ? bytesTwoDecimalPlaces(diskLimitSoft) : '') +
        (diskLimitHard ? ' / ' + bytesTwoDecimalPlaces(diskLimitHard) : '') +
        ')'
      : '';

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="CPU Total %">
          <MetricValue snapshotId={snapshotId} metric="cpu.total" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={`CPU ${cpuLimit ? '(Limit: ' + cpuLimit + ')' : ''}`}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total', 'cpu.system', 'cpu.user'],
            labels: ['Total', 'Kernel', 'User'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={`Memory ${memoryLimit ? '(Limit: ' + bytesTwoDecimalPlaces(memoryLimit) + ')' : ''}`}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: memoryLimit,
            metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
            labels: ['Usage', 'RSS', 'Cache'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
            labels: ['Active Anonymous', 'Active Cache', 'Inactive Anonymous', 'Inactive Cache'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={`Disk Usage ${diskLimit}`}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: diskLimitHard,
            metrics: [
              'disk.totalBytesUsed',
              'disk.totalInodesUsed',
              'disk.exclusiveBytesUsed',
              'disk.exclusiveInodesUsed'
            ],
            labels: ['Total Bytes', 'Total Inodes', 'Exclusive Bytes', 'Exclusive Inodes'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['network.rxBytes', 'network.txBytes'],
            labels: ['Received', 'Transmitted'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
