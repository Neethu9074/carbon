import React, { Fragment } from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces,
  millis,
  number,
  percentage,
  twoDecimalPlaces,
  time
} from 'in-services/formatters/number';

import ManagementButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ManagementButtonSection';
import InfoButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/InfoButtonSection';
import SensorTimingList from 'in-forge/plugins/instanaAgent/Dashboard/SensorTimingList';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import SpanMetrics from 'in-forge/plugins/instanaAgent/Dashboard/SpanMetrics';
import BundleList from 'in-forge/plugins/instanaAgent/Dashboard/BundleList';
import LogMetrics from 'in-forge/plugins/instanaAgent/Dashboard/LogMetrics';
import SensorList from 'in-forge/plugins/instanaAgent/Dashboard/SensorList';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { isInstanaEngineer } from 'in-stores/user';
import theme from 'in-themes';

export default function InstanaAgentDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <DashboardSection title="Management">
        <ManagementButtonSection snapshot={snapshot} />
      </DashboardSection>
      <DashboardSection title="Info">
        <InfoButtonSection snapshot={snapshot} />
      </DashboardSection>

      <Columize>
        {snapshot.getIn(['data', 'hasCpuLoad']) ? (
          <DashboardSection title="CPU Load">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['cpu.load'],
                labels: ['Load'],
                type: 'stackedArea',
                formatter: number.detailed
              }}
            />
          </DashboardSection>
        ) : null}
        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: snapshot.getIn(['data', 'memory.total']),
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['memory.used'],
              labels: ['Used'],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: snapshot.getIn(['data', 'memory.nativeTotal']),
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['memory.nativeUsed'],
              labels: ['Native Used'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Garbage Collection">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: time,
            metrics: ['gc.Copy.time', 'gc.MarkSweepCompact.time'],
            labels: ['Copy Time', 'MarkSweepCompact Time'],
            type: 'line'
          }}
          y2={{
            formatter: twoDecimalPlaces,
            metrics: ['gc.Copy.count', 'gc.MarkSweepCompact.count'],
            labels: ['Copy Invocation', 'MarkSweepCompact Invocation'],
            type: 'point'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesPerSecondZeroDecimalPlaces,
            tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
            metrics: ['net.rx', 'net.tx'],
            labels: ['Received', 'Sent'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Discovery">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['discovery.time'],
            labels: ['Discovery time'],
            type: 'line',
            formatter: millis.compact
          }}
          y2={{
            min: 0,
            metrics: ['discovery.count'],
            labels: ['Discovery Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Sensors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['sensors.time'],
            labels: ['Sense time'],
            type: 'line',
            formatter: millis.compact
          }}
          y2={{
            min: 0,
            metrics: ['sensors.count'],
            labels: ['Sensor Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      {isInstanaEngineer && (
        <Fragment>
          <SensorList snapshot={snapshot} />
          <DashboardSection title="Sensor Scheduler Workload">
            <ChartExplanation>
              The percentage of available time consumed by all operations run by the sensors scheduler during the given
              time period.
            </ChartExplanation>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['sensors.scheduler.consumed'],
                labels: ['Time Consumed'],
                type: 'line',
                formatter: percentage
              }}
            />
          </DashboardSection>
          <DashboardSection title="Slow Sensors">
            <ChartExplanation>
              The sensor count taking longer for an operation than expected. See the sensor timings list for detailed
              information.
            </ChartExplanation>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['sensors.scheduler.slow'],
                labels: ['Slow sensors'],
                type: 'bar',
                aggregation: 'sum',
                minPixelsPerBlock: 5,
                colors: [theme.lib.colors.failure],
                formatter: number.compact
              }}
            />
          </DashboardSection>
          <SensorTimingList snapshot={snapshot} />
          <LogMetrics snapshot={snapshot} timeConfig={timeConfig} />
          <BundleList snapshot={snapshot} />

          <DashboardSection title="Spans">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['spans.opened', 'spans.closed', 'spans.filtered', 'spans.dropped'],
                labels: ['Opened', 'Closed', 'Filtered', 'Dropped'],
                type: 'line',
                formatter: number.compact
              }}
            />
          </DashboardSection>
          <SpanMetrics snapshot={snapshot} timeConfig={timeConfig} />
        </Fragment>
      )}

      <DashboardSection title="Log Output">
        <LogStreamer snapshot={snapshot} />
      </DashboardSection>
    </Fragment>
  );
}
