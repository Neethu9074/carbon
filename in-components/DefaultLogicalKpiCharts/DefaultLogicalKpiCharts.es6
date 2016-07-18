import React from 'react';

import {msTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';


export default function DefaultLogicalKpiCharts({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Calls/s vs. Average Latency'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
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

      <DashboardSection title='Latency'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msTwoDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
                           metrics: [
                             'duration.max',
                             'duration.99th',
                             'duration.98th',
                             'duration.95th',
                             'duration.75th',
                             'duration.50th',
                             'duration.25th',
                             'duration.min'
                           ],
                           labels: [
                             'latency max',
                             'latency 99th',
                             'latency 98th',
                             'latency 95th',
                             'latency 75th',
                             'latency 50th',
                             'latency 25th',
                             'latency min'
                           ],
                           type: 'area'
                         }} />
      </DashboardSection>

      <DashboardSection title='Errors/s'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: zeroDecimalPlaces,
                           tooltipFormatter: zeroDecimalPlaces,
                           metrics: [
                             'error_count'
                           ],
                           labels: [
                             'errors'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
    </div>
  );
}
