import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {Row, Col} from 'in-components/Grid';
import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';

export default function QueuesTable({snapshot, timeframe}) {
  const queues = snapshot.getIn(['data', 'queues'], emptyList).sort();

  if (queues.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Queues'>
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
      </tr>
    </thead>
  );
}


function createRow(queueName) {
  return ([
    <td>{queueName}</td>
  ]);
}


function createDetails(queueName, i, context) {
  return (
    <div>
      <Row>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'queue_map.' + queueName + '.publish',
                    'queue_map.' + queueName + '.deliver',
                    'queue_map.' + queueName + '.ack'
                  ],
                  labels: [
                    'Published messages',
                    'Delivered messages',
                    'Acknowledged messages'
                  ],
                  type: 'line'
                }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'queue_map.' + queueName + '.publish_rate',
                    'queue_map.' + queueName + '.deliver_rate',
                    'queue_map.' + queueName + '.ack_rate'
                  ],
                  labels: [
                    'Publish rate',
                    'Deliver rate',
                    'Acknowledge rate'
                  ],
                  type: 'line',
                  min: 0,
                  max: 1,
                  formatter: twoDecimalPlaces
                }}/>
        </Col>
      </Row>

      <Row>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'queue_map.' + queueName + '.messages_ready',
                    'queue_map.' + queueName + '.messages_unacknowledged',
                    'queue_map.' + queueName + '.messages'
                  ],
                  labels: [
                    'Messages ready',
                    'Messages unacknowledged',
                    'Messages total'
                  ],
                  type: 'line'
                }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'queue_map.' + queueName + '.messages_ready_rate',
                    'queue_map.' + queueName + '.messages_unacknowledged_rate',
                    'queue_map.' + queueName + '.messages_rate'
                  ],
                  labels: [
                    'Messages ready rate',
                    'Unacknowledged rate',
                    'Messages total rate'
                  ],
                  type: 'line',
                  min: 0,
                  max: 1,
                  formatter: twoDecimalPlaces
                }}/>
        </Col>
      </Row>

      <Row>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'queue_map.' + queueName + '.consumers'
                  ],
                  labels: [
                    'Consumers'
                  ],
                  type: 'line'
                }}/>
        </Col>
        <Col cols={6}>
          <ChartWithLegend snapshot={context.snapshot}
                timeframe={context.timeframe}
                height={150}
                margins={{
                  left: 80
                }}
                y1={{
                  formatter: bytesZeroDecimalPlaces,
                  tooltipFormatter: bytesTwoDecimalPlaces,
                  metrics: [
                    'queue_map.' + queueName + '.memory'
                  ],
                  labels: [
                    'Memory use'
                  ],
                  type: 'line'
                }}/>
        </Col>
      </Row>
    </div>
  );
}
