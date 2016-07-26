import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


export default function NginxDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title='Requests'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={timeframe}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 metrics: [
                   'requests'
                 ],
                 labels: [
                   'Requests / s'
                 ],
                 type: 'line'
               }}/>
      </DashboardSection>

      <DashboardSection title='Connections'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={timeframe}
               margins={{
                 left: 80,
                 right: 80
               }}
               y1={{
                 min: 0,
                 metrics: [
                   'connections.accepted',
                   'connections.handled',
                   'connections.active',
                   'connections.dropped'
                 ],
                 labels: [
                   'Accepted connections',
                   'Handled connections',
                   'Active connections',
                   'Dropped connections'
                 ],
                 type: 'line'
               }}
               y2={{
                 min: 0,
                 metrics: [
                   'connections.reading',
                   'connections.writing',
                   'connections.waiting'
                 ],
                 labels: [
                   'Reading',
                   'Writing',
                   'waiting'
                 ],
                 type: 'line'
               }}/>
      </DashboardSection>
    </div>
  );
}

NginxDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
