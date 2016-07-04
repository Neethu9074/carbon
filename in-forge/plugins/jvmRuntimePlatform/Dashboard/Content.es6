import irpt from 'react-immutable-proptypes';
import React from 'react';

import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import {bytesTwoDecimalPlaces, time} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

export default function JVMDashboard({snapshot, timeframe}) {
  const collectors = snapshot.getIn(['data', 'jvm.collectors']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title='Threads'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 60
                         }}

                         y1={{
                           min: 0,
                           metrics: [
                             'threads.new',
                             'threads.runnable',
                             'threads.timed-waiting',
                             'threads.waiting',
                             'threads.blocked',
                             'threads.terminated'
                           ],
                           labels: [
                             'New',
                             'Runnable',
                             'Timed-Waiting',
                             'Waiting',
                             'Blocked',
                             'Terminated'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           max: snapshot.getIn(['data', 'memory.max']),
                           formatter: bytesTwoDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'memory.used'
                           ],
                           labels: [
                             'Used'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>

      <MemoryPoolsTable snapshot={snapshot}
                        timeframe={timeframe} />

      {collectors ?
        <DashboardSection title='Garbage Collection'>
          <ChartWithLegend snapshotId={snapshotId}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80,
                   right: 80
                 }}

                 y1={{
                   metrics: collectors.map((name) =>
                              'gc.' + name + '.time'
                            ).toArray(),
                   labels: collectors.map((name) =>
                              name + ' Time'
                            ).toArray(),
                   type: 'line',
                   formatter: time
                   }}

                 y2={{
                   metrics: collectors.map((name) =>
                              'gc.' + name + '.inv'
                            ).toArray(),
                   labels: collectors.map((name) =>
                              name + ' Invocations'
                            ).toArray(),
                   type: 'point'
                 }}/>
        </DashboardSection>
      : null}

      <JmxMetricsTable snapshot={snapshot}
                       timeframe={timeframe} />
    </div>
  );
}

JVMDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
