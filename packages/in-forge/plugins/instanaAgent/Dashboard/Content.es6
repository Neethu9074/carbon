import React, { Fragment } from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces,
  millis,
  number
} from 'in-services/formatters/number';
import ButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ButtonSection';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';

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
      <Columize>
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
              metrics: ['sensors.time', 'discovery.time'],
              labels: ['Sensor time', 'Discovery time'],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['sensors.count', 'discovery.count'],
              labels: ['Sensor Count', 'Discovery Count'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Log Output">
        <LogStreamer snapshot={snapshot} />
      </DashboardSection>
    </Fragment>
  );
}
