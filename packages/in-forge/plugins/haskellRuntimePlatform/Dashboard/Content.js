/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesTwoDecimalPlaces, millis, time, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { gaugeMetricNames } from '../metricDefinitions';
import MetricValue from 'in-components/MetricValue';
import GaugesTable from './GaugesTable';

export default function HaskellDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="CPU Time/second">
          <MetricValue snapshotId={snapshotId} metric="rts.gc.cpu_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="GC CPU Time/second">
          <MetricValue snapshotId={snapshotId} metric="rts.gc.gc_cpu_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="GC Wall Clock Time/second">
          <MetricValue snapshotId={snapshotId} metric="rts.gc.gc_wall_ms_delta" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="#GCs/second">
          <MetricValue snapshotId={snapshotId} metric="rts.gc.num_gcs_delta" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Total Bytes Allocated/second">
          <MetricValue
            snapshotId={snapshotId}
            metric="rts.gc.bytes_allocated_delta"
            formatter={bytesTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="GC Times">
        <ChartExplanation>
          <div>
            <ul>
              <li>GC CPU Time: CPU time spent running GC</li>
              <li>GC Wall Clock Time: wall clock time spent running GC</li>
              <li>
                Mutator Threads CPU Time: CPU time spent running mutator threads. This does not include any profiling
                overhead or initialization.
              </li>
            </ul>
          </div>
        </ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['rts.gc.gc_cpu_ms_delta', 'rts.gc.gc_wall_ms_delta', 'rts.gc.mutator_cpu_ms_delta'],
            labels: ['GC CPU Time/Second', 'GC Wall Clock Time/Second', 'Mutator Threads CPU Time/Second'],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="GC Bytes">
        <ChartExplanation>
          <div>
            <ul>
              <li>Bytes Copied: number of bytes copied during GC</li>
              <li>Byte Usage Samples: number of byte usage samples taken</li>
            </ul>
          </div>
        </ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['rts.gc.bytes_copied_delta', 'rts.gc.num_bytes_usage_samples_delta'],
            labels: ['Bytes Copied/Second', 'Byte Usage Samples/Second'],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="CPU">
        <ChartExplanation>CPU Time: CPU time per second</ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['rts.gc.cpu_ms_delta'],
            labels: ['Total CPU Time/Second'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="GCs/Second">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['rts.gc.num_gcs_delta'],
            labels: ['#GCs/Second'],
            type: 'point'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} metrics={gaugeMetricNames} title="GC Gauges" />
    </div>
  );
}
