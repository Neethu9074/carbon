import React from 'react';

import {msTwoDecimalPlaces, zeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function DefaultLogicalKpiCharts({snapshot, timeframe}) {
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
      <KpiKeyValue label='avg. latency'>
        <MetricValue snapshotId={snapshotId}
                     metric='duration.mean'
                     formatter={msTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label='error rate'>
        <MetricValue snapshotId={snapshotId}
                     metric='error_rate'
                     formatter={percentageTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label='instances'>
        <MetricValue snapshotId={snapshotId}
                     metric='instances'
                     formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>

      <DashboardSection title='Calls/s vs. Average Latency'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: zeroDecimalPlaces,
                           tooltipFormatter: zeroDecimalPlaces,
                           metrics: [
                             'count'
                           ],
                           labels: [
                             'calls/s'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           formatter: msTwoDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
                           metrics: [
                             'duration.mean'
                           ],
                           labels: [
                             'average latency'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>

      <DashboardSection title='Latency vs. min/max'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={400}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msTwoDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
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

      <DashboardSection title='Errors/s'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: percentageTwoDecimalPlaces,
                           tooltipFormatter: percentageTwoDecimalPlaces,
                           metrics: [
                             'error_rate'
                           ],
                           labels: [
                             'error rate'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>

      <DashboardSection title='Instances'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: zeroDecimalPlaces,
                           tooltipFormatter: zeroDecimalPlaces,
                           metrics: [
                             'instances'
                           ],
                           labels: [
                             'instances'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
    </div>
  );
}
