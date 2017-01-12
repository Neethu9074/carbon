import React from 'react';

import {
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function DefaultLogicalServiceDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='calls/s'>
          <MetricValue snapshotId={snapshotId}
                       metric='count'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix='#calls in ' />}>
          <MetricValue snapshotId={snapshotId}
                       formatter={zeroDecimalPlaces}
                       metric='count'
                       timeWindowAggregation='adjustedCount' />
        </KpiKeyValue>
        <KpiKeyValue label='time to page load'>
          <MetricValue snapshotId={snapshotId}
                       metric='duration.mean'
                       formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix='avg. time to page load in ' />}>
          <MetricValue snapshotId={snapshotId}
                       metric='duration.mean'
                       formatter={msZeroDecimalPlaces}
                       timeWindowAggregation='mean' />
        </KpiKeyValue>
        <KpiKeyValue label='time to first paint'>
          <MetricValue snapshotId={snapshotId}
                       metric='fp.mean'
                       formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix='avg. time to first paint in ' />}>
          <MetricValue snapshotId={snapshotId}
                       metric='fp.mean'
                       formatter={msZeroDecimalPlaces}
                       timeWindowAggregation='mean' />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='Calls/s'>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: twoDecimalPlaces,
                             metrics: [
                               'count'
                             ],
                             labels: [
                               'calls/s'
                             ],
                             type: 'line'
                           }} />
        </DashboardSection>

        <DashboardSection title='Page Load Time'>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: msTwoDecimalPlaces,
                             metrics: [
                               'duration.mean'
                             ],
                             labels: [
                               'Page Load Time'
                             ],
                             type: 'line'
                           }} />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title='Navigation Timing'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msZeroDecimalPlaces,
                           metrics: [
                             'unl.mean',
                             'red.mean',
                             'apc.mean',
                             'dns.mean',
                             'tcp.mean',
                             'req.mean',
                             'rsp.mean',
                             'pro.mean',
                             'loa.mean'
                           ],
                           labels: [
                             'Unload',
                             'Redirect',
                             'AppCache',
                             'DNS',
                             'TCP',
                             'Request',
                             'Response',
                             'Processing',
                             'Load'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>

      <DashboardSection title='Time to First Paint'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msZeroDecimalPlaces,
                           metrics: [
                             'fp.mean'
                           ],
                           labels: [
                             'First paint time'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>

      <DashboardSection title='Load Time Overview'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msZeroDecimalPlaces,
                           metrics: [
                             'duration.min',
                             'duration.25th',
                             'duration.50th',
                             'duration.75th',
                             'duration.95th',
                             'duration.98th',
                             'duration.99th',
                             'duration.max'
                           ],
                           labels: [
                             'min',
                             '25th',
                             '50th',
                             '75th',
                             '95th',
                             '98th',
                             '99th',
                             'max'
                           ],
                           type: 'integral'
                         }} />
      </DashboardSection>

      <ClusterNodes snapshotId={snapshotId}
                    timeframe={timeframe} />

      <Connections snapshotId={snapshotId}
                   timeframe={timeframe} />
    </div>
  );
}
