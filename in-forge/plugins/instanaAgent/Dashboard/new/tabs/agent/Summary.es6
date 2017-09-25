import React from 'react';

import { bytesTwoDecimalPlaces, bytesPerSecondTwoDecimalPlaces } from 'in-services/formatters/number';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Columize from 'in-sdk/components/dashboard/Columize';
import KV from 'in-sdk/components/dashboard/KV';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel>
        {getLabel(snapshot)}
      </SnapshotLabel>

        <Kpis>
          <KV k="Boot Version" v={snapshot.getIn(['data', 'boot'])} size="sm" />
          <KV k="Mode" v={modes[snapshot.getIn(['data', 'mode'])]} size="sm" />
          <KV k="Log Level" v={logLevels[snapshot.getIn(['data', 'loglevel'])]} size="sm" />
          <KV
            k="Java Runtime"
            v={`${snapshot.getIn(['data', 'java', 'vmvendor'])} ${snapshot.getIn(['data', 'java', 'version'])}`}
            size="sm" />
        </Kpis>

      <Columize>
        {snapshot.getIn(['data', 'hasCpuLoad'])
          ? <DashboardTile title="CPU Load">
              <Chart
                snapshotId={snapshot.get('id')}
                timeframe={timeframe}
                margins={{
                  left: 60
                }}
                y1={{
                  min: 0,
                  metrics: ['cpu.load'],
                  labels: ['Load'],
                  type: 'stackedArea'
                }}
              />
            </DashboardTile>
          : null}
        <DashboardTile title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 100,
              right: 100
            }}
            y1={{
              min: 0,
              max: snapshot.getIn(['data', 'memory.total']),
              formatter: bytesTwoDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['memory.used'],
              labels: ['Used'],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: snapshot.getIn(['data', 'memory.nativeTotal']),
              formatter: bytesTwoDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['memory.nativeUsed'],
              labels: ['Native Used'],
              type: 'line'
            }}
          />
        </DashboardTile>
      </Columize>
      <Columize>
        <DashboardTile title="Network">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 100
            }}
            y1={{
              min: 0,
              formatter: bytesPerSecondTwoDecimalPlaces,
              tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
              metrics: ['net.rx', 'net.tx'],
              labels: ['Received', 'Sent'],
              type: 'line'
            }}
          />
        </DashboardTile>
        <DashboardTile title="Sensors">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 100,
              right: 100
            }}
            y1={{
              min: 0,
              metrics: ['sensors.time', 'discovery.time'],
              labels: ['Sensor time', 'Discovery time'],
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['sensors.count', 'discovery.count'],
              labels: ['Sensor Count', 'Discovery Count'],
              type: 'line'
            }}
          />
        </DashboardTile>
      </Columize>
    </MaxWidthFullscreenContainer>
  );
}
