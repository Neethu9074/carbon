
import irpt from 'react-immutable-proptypes';
import React from 'react';

import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import {twoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';


export default function RabbitMqDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title='Messages'>
          <ChartWithLegend snapshotId={snapshotId}
                timeframe={timeframe}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.publish_rate',
                    'overview.deliver_rate',
                    'overview.ack_rate'
                  ],
                  labels: [
                    'Published per 5 seconds',
                    'Delivered per 5 seconds',
                    'Acknowledged per 5 seconds'
                  ],
                  type: 'line',
                  formatter: twoDecimalPlaces
                }}/>

        <TwoColumnRow>
          <ChartWithLegend snapshotId={snapshotId}
                timeframe={timeframe}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.messages_ready',
                    'overview.messages_unacknowledged',
                    'overview.messages'
                  ],
                  labels: [
                    'Messages ready',
                    'Messages unacknowledged',
                    'Messages total'
                  ],
                  type: 'line'
                }}/>
          <ChartWithLegend snapshotId={snapshotId}
                timeframe={timeframe}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.messages_ready_rate',
                    'overview.messages_unacknowledged_rate',
                    'overview.messages_rate'
                  ],
                  labels: [
                    'Messages ready rate',
                    'Unacknowledged rate',
                    'Messages total rate'
                  ],
                  type: 'line',
                  formatter: twoDecimalPlaces
                }}/>
        </TwoColumnRow>
      </DashboardSection>

      <DashboardSection title='Overview'>
        <ChartWithLegend snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                metrics: [
                  'overview.consumers',
                  'overview.connections'
                ],
                labels: [
                  'Consumers',
                  'Connections'
                ],
                type: 'line'
              }}/>
      </DashboardSection>

      <NodesTable snapshot={snapshot}
                  timeframe={timeframe} />

      <QueuesTable snapshot={snapshot}
                   timeframe={timeframe} />

    </div>
  );
}

RabbitMqDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
