import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import {timeNs, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function GolangDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='GC Pause'>
          <MetricValue snapshotId={snapshotId}
                       metric='metrics.memory.pause_ns'
                       formatter={timeNs} />
        </KpiKeyValue>
        <KpiKeyValue label='Heap Used'>
          <MetricValue snapshotId={snapshotId}
                       metric='metrics.memory.heap_in_use'
                       formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Executed Goroutines'>
          <MetricValue snapshotId={snapshotId}
                       metric='metrics.goroutine' />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='Memory Usage'>
          {renderMemoryMetrics(snapshot, timeframe)}
        </DashboardSection>

        <DashboardSection title='Heap Usage'>
          {renderHeapMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title='GC Activity'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}

                         y1={{
                           min: 0,
                           formatter: timeNs,
                           metrics: [
                             'metrics.memory.pause_ns'
                           ],
                           labels: [
                             'GC Pause'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Goroutines'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}

                         y1={{
                           min: 0,
                           metrics: [
                             'metrics.goroutine'
                           ],
                           labels: [
                             'Executed Goroutines'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>
    </div>
  );
}

function renderHeapMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: bytesTwoDecimalPlaces,
                       metrics: [
                         'metrics.memory.heap_sys',
                         'metrics.memory.heap_in_use'
                       ],
                       labels: [
                         'System Heap',
                         'Used Heap'
                       ],
                       type: 'line'
                     }}

                     y2={{
                       min: 0,
                       metrics: [
                         'metrics.memory.heap_objects'
                       ],
                       labels: [
                         'Objects'
                       ],
                       type: 'line'
                     }}
                     />
  );
}

function renderMemoryMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: bytesTwoDecimalPlaces,
                       metrics: [
                         'metrics.memory.alloc',
                         'metrics.memory.sys'
                       ],
                       labels: [
                         'Allocated Memory',
                         'Obtained From System'
                       ],
                       type: 'line'
                     }}/>
  );
}
