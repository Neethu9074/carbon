import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';
import {
  KpiSection,
  KpiHeading,
  KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function ClrDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='All heaps'>
          <MetricValue snapshotId={snapshotId}
                       metric='mem.all_heaps'
                       formatter={bytesZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='% Time in GC'>
          <MetricValue snapshotId={snapshotId}
                       metric='mem.time_in_gc'
                       formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Contention-Rate'>
          <MetricValue snapshotId={snapshotId}
                       metric='threads.lck_crs'
                       formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Queue-Length'>
          <MetricValue snapshotId={snapshotId}
                       metric='threads.lck_cql'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Garbage Collections'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}

                         y1={{
                            min: 0,
                            metrics: [
                              'mem.gen0GC',
                              'mem.gen1GC',
                              'mem.gen2GC'
                            ],
                            labels: [
                              'Generation 0',
                              'Generation 1',
                              'Generation 2'
                            ],
                            type: 'point',
                            formatter: zeroDecimalPlaces
                          }}

                         y2={{
                           min: 0,
                           max: 100,
                           metrics: [
                             'mem.time_in_gc'
                           ],
                           labels: [
                             'Time spent in GC (%)'
                           ],
                           type: 'line',
                           formatter: twoDecimalPlaces
                         }} />
      </DashboardSection>

      <DashboardSection title='Sizes of Heaps'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'mem.gen1HeapBytes',
                             'mem.gen2HeapBytes',
                             'mem.loHeapBytes'
                           ],
                           labels: [
                             'Generation 1',
                             'Generation 2',
                             'Large Objects'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>
      <DashboardSection title='Thread-Locks and Contention'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'threads.lck_cql'
                           ],
                           labels: [
                             'Queue-Length'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           formatter: twoDecimalPlaces,
                           metrics: [
                             'threads.lck_crs'
                           ],
                           labels: [
                             'Contention-Rate'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
    </div>
  );
}
