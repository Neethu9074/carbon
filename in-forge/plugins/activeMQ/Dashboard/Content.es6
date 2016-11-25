import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


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

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='All Queues Messages Enqueue'>
          <MetricValue snapshotId={snapshotId}
                       metric='totalQueuesEnqueueCount' />
        </KpiKeyValue>
        <KpiKeyValue label='Memory Usage'>
          <MetricValue snapshotId={snapshotId}
                       metric='memoryPercentUsage'
                       formatter={percentage} />
        </KpiKeyValue>
        <KpiKeyValue label='Storage Usage'>
          <MetricValue snapshotId={snapshotId}
                       metric='storePercentUsage'
                       formatter={percentage} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Broker wide queues message stats'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'totalQueuesEnqueueCount',
                            'totalQueuesDequeueCount'
                          ],
                          labels: [
                            'All Queues Messages Enqueue',
                            'All Queues Messages Dequeue'
                          ],
                          type: 'line'
                         }} />
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
                         }} />
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
                         }} />
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
                         }} />
      </DashboardSection>
    </div>
  );
}
