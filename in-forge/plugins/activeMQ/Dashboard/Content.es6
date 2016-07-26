import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';
import DashboardNotification from 'in-components/DashboardNotification';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const percentage = d => d + '%';

export default function ActiveMQDashboard({snapshot, timeframe}) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='info'>
        Jmx is not enabled. You can enable it in activemq config by setting the broker property useJmx to true.
      </DashboardNotification>
    );
  }
  return (
    <div>
      <DashboardSection title='Broker wide queues message stats'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'totalQueuesEnqueueCount'
                          ],
                          labels: [
                            'All Queues Messages Enqueue'
                          ],
                          type: 'line'
                         }}/>
      </DashboardSection>
      <DashboardSection title='Broker wide topics message stats'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'totalTopicsDequeueCount',
                            'totalTopicsEnqueueCount'
                          ],
                          labels: [
                            'All Topics Messages Dequeue',
                            'All Topics Messages Enqueue'
                          ],
                          type: 'line'
                         }}/>
      </DashboardSection>
      <DashboardSection title='Broker wide connections, consumers and producers'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'totalConnectionsCount',
                            'totalConsumerCount',
                            'totalProducerCount'
                          ],
                          labels: [
                            'Total Connections',
                            'Total Consumers',
                            'Total Producers'
                          ],
                          type: 'line'
                         }}/>
      </DashboardSection>
      <DashboardSection title='Memory and store usage'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'memoryPercentUsage',
                            'storePercentUsage'
                          ],
                          labels: [
                            'Memory Usage',
                            'Store Usage'
                          ],
                          formatter: percentage,
                          type: 'line'
                         }}/>
      </DashboardSection>
    </div>
  );
}

ActiveMQDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
