import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function MariaDbDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }
  return (
    <div>
      <DashboardSection title='Clients'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'status.THREADS_CONNECTED'
                           ],
                           labels: [
                             'Connections'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      <DashboardSection title='Slow Queries'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'status.SLOW_QUERIES'
                           ],
                           labels: [
                             'Slow Queries'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      <DashboardSection title='Key Access'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'status.KEY_READ_REQUESTS',
                             'status.KEY_WRITE_REQUESTS'
                           ],
                           labels: [
                             'Read Requests',
                             'Write Requests'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           metrics: [
                             'status.KEY_READS',
                             'status.KEY_WRITES'
                           ],
                           labels: [
                             'Reads',
                             'Writes'
                           ],
                           type: 'line'
                         }}
                         />
      </DashboardSection>
      <DashboardSection title='Aria Engine Properties'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'status.ARIA_PAGECACHE_READS',
                             'status.ARIA_PAGECACHE_WRITES'
                           ],
                           labels: [
                             'Pagecache Reads',
                             'Pagecache Writes'
                           ],
                           type: 'line'
                         }}
                         />
      </DashboardSection>

    </div>
  );
}

MariaDbDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
