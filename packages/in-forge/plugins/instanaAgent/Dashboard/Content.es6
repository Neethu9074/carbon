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
import ButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ButtonSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { isInstanaEngineer } from 'in-stores/user';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import SensorTimingList from 'in-forge/plugins/instanaAgent/Dashboard/SensorTimingList';

export default function InstanaAgentDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <DashboardSection title="Management">
        <ButtonSection snapshot={snapshot} />
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
          <DashboardSection title="Sensor Scheduler">
            <ChartExplanation>
              Sense count is the number of sensor tasks the scheduler managed to perform during the given period period.
              Time consumed is the percentage of available time to the scheduler consumed by all operations during the
              given time period.
            </ChartExplanation>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['sensors.scheduler.tasks'],
                labels: ['Sense count'],
                type: 'line',
                formatter: number.compact
              }}
              y2={{
                min: 0,
                metrics: ['sensors.scheduler.consumed'],
                labels: ['Time Consumed'],
                type: 'line',
                formatter: percentage.compact
              }}
            />
          </DashboardSection>
          <SensorTimingList snapshot={snapshot} />
        </Fragment>
      )}
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

      <DashboardSection title="Log Output">
        <LogStreamer snapshot={snapshot} />
      </DashboardSection>
    </Fragment>
  );
}
