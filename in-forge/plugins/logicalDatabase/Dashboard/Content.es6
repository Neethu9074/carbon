import irpt from 'react-immutable-proptypes';
import React from 'react';

import {msTwoDecimalPlaces, twoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalDatabaseDashboard({snapshot, timeframe}) {
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
                           formatter: twoDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
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
                           formatter: twoDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
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
                             'duration.min',
                             'duration.max',
                             'duration.25th',
                             'duration.50th',
                             'duration.75th',
                             'duration.95th',
                             'duration.98th',
                             'duration.99th'
                           ],
                           labels: [
                             'latency min',
                             'latency max',
                             'latency 25th',
                             'latency 50th',
                             'latency 75th',
                             'latency 95th',
                             'latency 98th',
                             'latency 99th'
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
                           formatter: msTwoDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
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

LogicalDatabaseDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
