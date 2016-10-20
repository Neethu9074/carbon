import React from 'react';

import {
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';

const hitRateFormatter = d => d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d);

export default function GlassfishDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='warning'>
        Amx module is not enabled. Please enable the Amx module to support metric collection.
      </DashboardNotification>
    );
  }
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='Requests'>
          <MetricValue snapshotId={snapshotId}
                       metric='http_request_count'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Errors'>
          <MetricValue snapshotId={snapshotId}
                       metric='http_error'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Max Time'>
          <MetricValue snapshotId={snapshotId}
                       metric='http_max_time'
                       formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title='Web Requests'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40,
                           right: 40
                         }}
                         y1={{
                           metrics: [
                             'http_request_count',
                             'http_error'
                           ],
                           labels: [
                             'Requests',
                             'Errors'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}
                         y2={{
                           metrics: [
                             'http_max_time',
                             'http_proc_time'
                           ],
                           labels: [
                             'Max Time',
                             'Processing Time'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: msZeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Threads'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40
                         }}
                         y1={{
                           metrics: [
                             'threads_core',
                             'threads_executed_tasks',
                             'threads_current_count',
                             'threads_current_busy'
                           ],
                           labels: [
                             'Core threads',
                             'Executed threads',
                             'Current threads',
                             'Busy threads'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Connections'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40
                         }}
                         y1={{
                           metrics: [
                             'connections_open',
                             'connections_overflows',
                             'connections_queued',
                             'connections_peak_queued',
                             'connections_ticks_total_queued',
                             'connections_total'
                           ],
                           labels: [
                             'Open',
                             'Overflows',
                             'Queued',
                             'Peak Queued',
                             'Ticks Total Queued',
                             'Total'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Keep Alive'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40
                         }}
                         y1={{
                           metrics: [
                             'keep_alive_connections',
                             'keep_alive_flushes',
                             'keep_alive_hits',
                             'keep_alive_refusals',
                             'keep_alive_timeouts'
                           ],
                           labels: [
                             'Connections',
                             'Flushes',
                             'Hits',
                             'Refusals',
                             'Timeouts'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='File cache'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40,
                           right: 40
                         }}
                         y1={{
                           metrics: [
                             'file_cache_hits',
                             'file_cache_misses',
                             'file_cache_info_hits',
                             'file_cache_info_misses'
                           ],
                           labels: [
                             'Hits',
                             'Misses',
                             'Info Hits',
                             'Info Misses'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}
                         y2={{
                           min: 0,
                           max: 1,
                           metrics: [
                             'file_cache_rate',
                             'file_cache_info_rate'
                           ],
                           labels: [
                             'Hit rate',
                             'Info hit rate'
                           ],
                           type: 'line',
                           formatter: hitRateFormatter
                         }}/>
      </DashboardSection>
      <DashboardSection title='JDBC Connections'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 40
                         }}
                         y1={{
                           metrics: [
                             'jdbc_connection_used',
                             'jdbc_connection_free'
                           ],
                           labels: [
                             'Used',
                             'Free'
                           ],
                           min: 0,
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
    </div>
  );
}
