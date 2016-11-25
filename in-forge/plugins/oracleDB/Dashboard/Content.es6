import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';


export default function OracleDBDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Reads'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'stats.physicalReads'
                           ],
                           labels: [
                             'Physical Reads'
                           ],
                           type: 'line'
                       }} />
      </DashboardSection>
    </div>
  );
}
