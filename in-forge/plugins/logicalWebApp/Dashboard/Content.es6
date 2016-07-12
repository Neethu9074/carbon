import irpt from 'react-immutable-proptypes';
import React from 'react';

import {withSiPrefixThreeDecimalPlaces, msTwoDecimalPlaces, twoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function LogicalWebAppDashboard({snapshot, timeframe}) {
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
                           formatter: withSiPrefixThreeDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
                           metrics: [
                             'count'
                           ],
                           labels: [
                             'calls/s'
                           ],
                           type: 'stackedArea'
                         }}
                         y2={{
                           min: 0,
                           formatter: withSiPrefixThreeDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
                           metrics: [
                             'error_count'
                           ],
                           labels: [
                             'errors/s'
                           ],
                           type: 'stackedArea'
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
                           formatter: withSiPrefixThreeDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
                           metrics: [
                             'duration.95th'
                           ],
                           labels: [
                             'latency 95th'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>
    </div>
  );
}

LogicalWebAppDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
