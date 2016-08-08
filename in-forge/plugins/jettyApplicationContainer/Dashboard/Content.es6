import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

import WebAppsTable from './WebAppsTable.es6';


export default function JettyDashboard({snapshot, timeframe}) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='info'>
        Jmx module is not enabled in jetty. Please enable it to be able to collect data.
        You can do so by adding '--module=jmx' in 'start.ini' file
      </DashboardNotification>
    );
  }
  return (
    <div>
      <DashboardSection title='Queued Thread Pool Stats'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'idleThreads',
                            'busyThreads',
                            'threads',
                            'threadsQueueSize'
                          ],
                          labels: [
                            'Idle Threads',
                            'Busy Threads',
                            'Total Threads',
                            'Threads Queue Size'
                          ],
                          type: 'line'
                         }}/>
      </DashboardSection>
      <WebAppsTable snapshot={snapshot} timeframe={timeframe}/>
    </div>
  );
}
