import React from 'react';

import ThreadDumpButton from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/ThreadDumpButton';
import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import {bytesTwoDecimalPlaces, time, twoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';

import './Content.less';


export default function JVMDashboard({snapshot, timeframe}) {
  const collectors = snapshot.getIn(['data', 'jvm.collectors']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='Memory Used'>
          <MetricValue snapshotId={snapshotId}
                       metric='memory.used'
                       formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Threads'>
        <ThreadDumpButton className='in-jvm-dashboard-thread-dump-button'
                          snapshot={snapshot} />

        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
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
                           type: 'stackedArea',
                           formatter: twoDecimalPlaces
                         }}/>
      </DashboardSection>

      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
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
                   type: 'point',
                   formatter: twoDecimalPlaces
                 }}/>
        </DashboardSection>
      : null}

      <JmxMetricsTable snapshot={snapshot}
                       timeframe={timeframe} />
    </div>
  );
}
