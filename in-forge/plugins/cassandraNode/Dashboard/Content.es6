import React from 'react';

import {
  muSecondsToMillisTwoDecimalPlaces,
  muSecondsToMillisZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  twoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import KeyspacesTable from 'in-forge/plugins/cassandraNode/Dashboard/KeyspacesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {capitalize} from 'in-services/formatters/string';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function CassandraDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='Read Requests'>
          <MetricValue snapshotId={snapshotId}
                       metric='clientrequests.read.count' />
        </KpiKeyValue>
        <KpiKeyValue label='Read Latency'>
          <MetricValue snapshotId={snapshotId}
                       metric='clientrequests.read.mean'
                       formatter={muSecondsToMillisZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Write Requests'>
          <MetricValue snapshotId={snapshotId}
                       metric='clientrequests.write.count' />
        </KpiKeyValue>
        <KpiKeyValue label='Write Latency'>
          <MetricValue snapshotId={snapshotId}
                       metric='clientrequests.write.mean'
                       formatter={muSecondsToMillisZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Requests'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'clientrequests.read.count',
                             'clientrequests.write.count'
                           ],
                           labels: [
                             'Read',
                             'Write'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }} />
      </DashboardSection>

      {['read', 'write'].map(op =>
        <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies'}
                          key={op}>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: muSecondsToMillisTwoDecimalPlaces,
                             metrics: [
                               'clientrequests.' + op + '.mean',
                               'clientrequests.' + op + '.50',
                               'clientrequests.' + op + '.95',
                               'clientrequests.' + op + '.99'
                             ],
                             labels: [
                               'Mean',
                               '50th Percentile',
                               '95th Percentile',
                               '99th Percentile'
                             ],
                             type: 'line'
                           }} />
        </DashboardSection>
      )}

      {['pending', 'blocked'].map(stage =>
        <DashboardSection title={capitalize(stage) + ' Requests in Threadpools (Stages)'}
                          key={stage}>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'stage.mutation.' + stage,
                               'stage.read.' + stage,
                               'stage.countermutation.' + stage,
                               'stage.readrepair.' + stage,
                               'stage.requestresponse.' + stage,
                               'stage.memtableflushwriter.' + stage
                             ],
                             labels: [
                               'Write (Mutation)',
                               'Read',
                               'Counter Mutation',
                               'Read Repair',
                               'Request/Response',
                               'Memtable Flushwriter'
                             ],
                             type: 'line',
                             formatter: twoDecimalPlaces
                           }} />
        </DashboardSection>
      )}

      <DashboardSection title='Dropped Messages'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'dropped.MUTATION',
                             'dropped.READ',
                             'dropped.COUNTER_MUTATION',
                             'dropped.READ_REPAIR',
                             'dropped.REQUEST_RESPONSE'
                           ],
                           labels: [
                             'Write (Mutation)',
                             'Read',
                             'Counter Mutation',
                             'Read Repair',
                             'Request/Response'
                           ],
                           type: 'line',
                           formatter: twoDecimalPlaces
                         }} />
      </DashboardSection>

      <KeyspacesTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title='Pending Compactions'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'compaction.pending'
                           ],
                           labels: [
                             'Compactions'
                           ],
                           type: 'line',
                           formatter: twoDecimalPlaces
                         }} />
      </DashboardSection>

      <DashboardSection title='Cache Hits'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           max: 1,
                           formatter: percentageTwoDecimalPlaces,
                           metrics: [
                             'cache.counter.hit',
                             'cache.key.hit',
                             'cache.row.hit'
                           ],
                           labels: [
                             'Counter',
                             'Key',
                             'Row'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>

      <DashboardSection title='Bloom Filter'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           max: 1,
                           formatter: percentageTwoDecimalPlaces,
                           metrics: [
                             'bloomFilterFalse'
                           ],
                           labels: [
                             'Miss Rate'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>
    </div>
  );
}
