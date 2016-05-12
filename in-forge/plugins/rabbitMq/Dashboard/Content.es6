import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import Collapsible from 'in-components/Collapsible';
import ResponsiveTable from 'in-components/ResponsiveTable';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

const chartHeight = 200;

function extractNodeName(nodeKey) {
  return nodeKey.split(/_/)[1];
}

function extractQueueName(queueKey) {
  return queueKey.split(/::/)[0];
}

const RabbitMqDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
    },
  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const nodeNames = data.get('nodes', emptyList).toArray();
    const queueNames = data.get('queues', emptyList).toArray();
    const channelNames = data.get('channels', emptyList).toArray();

    return (
      <div>
        <DashboardSection title='Overview'>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.publish',
                    'overview.deliver',
                    'overview.ack'
                  ],
                  labels: [
                    'Published messages',
                    'Delivered messages',
                    'Acknowledged messages'
                  ],
                  type: 'line'
                }}/>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
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
                    'Publish rate',
                    'Deliver rate',
                    'Acknowledge rate'
                  ],
                  type: 'line',
                  formatter: percentageZeroDecimalPlaces
                }}/>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
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
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
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
                  formatter: percentageZeroDecimalPlaces
                }}/>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.consumers'
                  ],
                  labels: [
                    'Consumers'
                  ],
                  type: 'line'
                }}/>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
                margins={{
                  left: 80
                }}
                y1={{
                  metrics: [
                    'overview.connections'
                  ],
                  labels: [
                    'Connections'
                  ],
                  type: 'line'
                }}/>
        </DashboardSection>

        <DashboardSection title='Nodes'>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Nodes</Collapsible.Header>
            <Collapsible.Content>
              {nodeNames && nodeNames.length > 0 ?
                nodeNames.map(nn =>
                  <DashboardSection key={nn} title={extractNodeName(nn)}>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'node_map.' + nn + '.fd_used',
                              'node_map.' + nn + '.fd_total'
                            ],
                            labels: [
                              'Used file descriptors',
                              'Total file descriptors'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            formatter: bytesZeroDecimalPlaces,
                            tooltipFormatter: bytesTwoDecimalPlaces,
                            metrics: [
                              'node_map.' + nn + '.mem_used',
                              'node_map.' + nn + '.mem_limit'
                            ],
                            labels: [
                              'Used memory',
                              'Memory limit'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'node_map.' + nn + '.proc_used',
                              'node_map.' + nn + '.proc_total'
                            ],
                            labels: [
                              'Erlang processes in use',
                              'Maximum number of Erlang processes'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            formatter: bytesZeroDecimalPlaces,
                            tooltipFormatter: bytesTwoDecimalPlaces,
                            metrics: [
                              'node_map.' + nn + '.disk_free',
                              'node_map.' + nn + '.disk_free_limit'
                            ],
                            labels: [
                              'Disk alarm threshold',
                              'Disk free space in bytes'
                            ],
                            type: 'line'
                          }}/>
                  </DashboardSection>
                )
              : null}
            </Collapsible.Content>
          </Collapsible>
        </DashboardSection>

        <DashboardSection title='Queues'>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Queues</Collapsible.Header>
            <Collapsible.Content>
              {queueNames && queueNames.length > 0 ?
                queueNames.map(queueKey =>
                  <DashboardSection key={queueKey} title={extractQueueName(queueKey)}>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + queueKey + '.publish',
                              'queue_map.' + queueKey + '.deliver',
                              'queue_map.' + queueKey + '.ack'
                            ],
                            labels: [
                              'Published messages',
                              'Delivered messages',
                              'Acknowledged messages'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend  snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + queueKey + '.publish_rate',
                              'queue_map.' + queueKey + '.deliver_rate',
                              'queue_map.' + queueKey + '.ack_rate'
                            ],
                            labels: [
                              'Publish rate',
                              'Deliver rate',
                              'Acknowledge rate'
                            ],
                            type: 'line',
                            formatter: percentageZeroDecimalPlaces
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + queueKey + '.messages_ready',
                              'queue_map.' + queueKey + '.messages_unacknowledged',
                              'queue_map.' + queueKey + '.messages'
                            ],
                            labels: [
                              'Messages ready',
                              'Messages unacknowledged',
                              'Messages total'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend  snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + queueKey + '.messages_ready_rate',
                              'queue_map.' + queueKey + '.messages_unacknowledged_rate',
                              'queue_map.' + queueKey + '.messages_rate'
                            ],
                            labels: [
                              'Messages ready rate',
                              'Unacknowledged rate',
                              'Messages total rate'
                            ],
                            type: 'line',
                            formatter: percentageZeroDecimalPlaces
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + queueKey + '.consumers'
                            ],
                            labels: [
                              'Consumers'
                            ],
                            type: 'line'
                          }}/>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            formatter: bytesZeroDecimalPlaces,
                            tooltipFormatter: bytesTwoDecimalPlaces,
                            metrics: [
                              'queue_map.' + queueKey + '.memory'
                            ],
                            labels: [
                              'Memory use'
                            ],
                            type: 'line'
                          }}/>
                  </DashboardSection>
                )
              : null}
            </Collapsible.Content>
          </Collapsible>
        </DashboardSection>

        {channelNames && channelNames.length > 0 ?
          <DashboardSection title='Channels'>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {channelNames.map(channelName =>
                  <tr key={channelName}>
                    <td>{channelName}</td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}

    </div>
  );
 }
});

export default RabbitMqDashboard;
