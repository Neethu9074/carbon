import irpt from 'react-immutable-proptypes';
import React from 'react';

import {msTwoDecimalPlaces, twoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalDatabaseDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Calls/s vs. Errors/s'>
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
                             'error_count'
                           ],
                           labels: [
                             'errors/s'
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
                             'duration.95th'
                           ],
                           labels: [
                             'latency 95th'
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
