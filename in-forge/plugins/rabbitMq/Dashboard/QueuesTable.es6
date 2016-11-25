import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import {emptyList} from 'in-services/fixedImmutables';
import {zeroDecimalPlaces} from 'in-services/formatters/number';


export default function QueuesTable({snapshot, timeframe}) {
  const queues = snapshot.getIn(['data', 'monitoredQueues'], emptyList).sort();
  if (queues.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Monitored Queues'>
      <ExpandableTable data={queues}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}

function getKey(queueName) {
  return queueName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Queue</th>
        <th>Messages ready</th>
        <th>Messages unacknowledged</th>
        <th>Messages total</th>
      </tr>
    </thead>
  );
}

function createRow(queueName, i, context) {
  return ([
    <td>{queueName}</td>,
    <Mtd metric={'queue_map.' + queueName + '.messages_ready'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'queue_map.' + queueName + '.messages_unacknowledged'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'queue_map.' + queueName + '.messages'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(queueName, i, context) {
  const snapshotId = context.snapshot.get('id');
  const timeframe = context.timeframe;

  return (
    <div>
      <ChartWithLegend snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: [
                'queue_map.' + queueName + '.messages_ready',
                'queue_map.' + queueName + '.messages_unacknowledged'
              ],
              labels: [
                'Messages ready',
                'Messages unacknowledged'
              ],
              type: 'stackedArea',
              formatter: zeroDecimalPlaces
            }}
            y2={{
              metrics: [
                'queue_map.' + queueName + '.messages'
              ],
              labels: [
                'Messages total'
              ],
              type: 'line',
              formatter: zeroDecimalPlaces
            }} />
    </div>
  );
}
