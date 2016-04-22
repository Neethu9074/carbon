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

function nodeMetricsFileDesc(nodeName) {
    const metrics = [];
    metrics.push('node_map.' + nodeName + '.fd_used');
    metrics.push('node_map.' + nodeName + '.fd_total');
    return metrics;
}

function nodeMetricsMemory(nodeName) {
  const metrics = [];
  metrics.push('node_map.' + nodeName + '.mem_used');
  metrics.push('node_map.' + nodeName + '.mem_limit');
  return metrics;
}

function nodeMetricsProcesses(nodeName) {
  const metrics = [];
  metrics.push('node_map.' + nodeName + '.proc_used');
  metrics.push('node_map.' + nodeName + '.proc_total');
  return metrics;
}

function nodeMetricsDisk(nodeName) {
  const metrics = [];
  metrics.push('node_map.' + nodeName + '.disk_free');
  metrics.push('node_map.' + nodeName + '.disk_free_limit');
  return metrics;
}

function queueMetricsMessagesSent(queueName) {
  const metrics = [];
  metrics.push('queue_map.' + queueName + '.publish');
  metrics.push('queue_map.' + queueName + '.publish_rate');
  metrics.push('queue_map.' + queueName + '.deliver');
  metrics.push('queue_map.' + queueName + '.deliver_rate');
  metrics.push('queue_map.' + queueName + '.ack');
  metrics.push('queue_map.' + queueName + '.ack_rate');
  return metrics;
}

function queueMetricsMessagesQueued(queueName) {
  const metrics = [];
  metrics.push('queue_map.' + queueName + '.messages_ready');
  metrics.push('queue_map.' + queueName + '.messages_ready_rate');
  metrics.push('queue_map.' + queueName + '.messages_unacknowledged');
  metrics.push('queue_map.' + queueName + '.messages_unacknowledged_rate');
  metrics.push('queue_map.' + queueName + '.messages');
  metrics.push('queue_map.' + queueName + '.messages_rate');
  return metrics;
}

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
                                metrics: [ 'overview.publish', 'overview.deliver', 'overview.ack' ],
                                labels: [ 'Published messages', 'Delivered messages', 'Acknowledged messages' ],
                                type: 'line'
                            }}
                            />
          <ChartWithLegend  snapshot={snapshot}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                              left: 80
                            }}
                            y1={{
                                metrics: [ 'overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate' ],
                                labels: [ 'Publish rate', 'Deliver rate', 'Acknowledge rate'],
                                type: 'line',
                                formatter: percentageZeroDecimalPlaces
                            }}
                            />
          <ChartWithLegend  snapshot={snapshot}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                              left: 80
                            }}
                            y1={{
                                metrics: [ 'overview.messages_ready',
                                         'overview.messages_unacknowledged',
                                         'overview.messages' ],
                                labels: [ 'Messages ready', 'Messages unacknowledged', 'Messages total' ],
                                type: 'line'
                            }}
                            />
          <ChartWithLegend  snapshot={snapshot}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                              left: 80
                            }}
                            y1={{
                                metrics: [ 'overview.consumers' ],
                                labels: [ 'Consumers' ],
                                type: 'line'
                            }}
                            />
          <ChartWithLegend  snapshot={snapshot}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                              left: 80
                            }}
                            y1={{
                              metrics: [ 'overview.connections' ],
                                labels: [ 'Conections' ],
                                type: 'line'
                            }}
                            />
        </DashboardSection>

        <DashboardSection title='Nodes'>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header></Collapsible.Header>
            <Collapsible.Content>
              {nodeNames && nodeNames.length > 0 ?
              nodeNames.map(nn =>
              <DashboardSection key={nn} title={extractNodeName(nn)}>
                <ChartWithLegend  snapshot={snapshot}
                                  timeframe={timeframe}
                                  height={chartHeight}
                                  margins={{
                                    left: 80
                                  }}
                                  y1={{
                                    metrics: nodeMetricsFileDesc(nn),
                                      labels: ['Used file descriptors', 'Total file descriptors'],
                                      type: 'line'
                                  }}/>
                <ChartWithLegend  snapshot={snapshot}
                                  timeframe={timeframe}
                                  height={chartHeight}
                                  margins={{
                                    left: 80
                                  }}
                                  y1={{
                                    formatter: bytesZeroDecimalPlaces,
                                    tooltipFormatter: bytesTwoDecimalPlaces,
                                    metrics: nodeMetricsMemory(nn),
                                      labels: ['Used memory', 'Memory limit'],
                                      type: 'line'
                                  }}/>

                <ChartWithLegend  snapshot={snapshot}
                                  timeframe={timeframe}
                                  height={chartHeight}
                                  margins={{
                                    left: 80
                                  }}
                                  y1={{
                                    metrics: nodeMetricsProcesses(nn),
                                      labels: ['Erlang processes in use', 'Maximum number of Erlang processes'],
                                      type: 'line'
                                  }}/>

                <ChartWithLegend  snapshot={snapshot}
                                  timeframe={timeframe}
                                  height={chartHeight}
                                  margins={{
                                    left: 80
                                  }}
                                  y1={{
                                    formatter: bytesZeroDecimalPlaces,
                                    tooltipFormatter: bytesTwoDecimalPlaces,
                                    metrics: nodeMetricsDisk(nn),
                                      labels: ['Disk alarm threshold', 'Disk free space in bytes'],
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
            <Collapsible.Header></Collapsible.Header>
            <Collapsible.Content>
              {queueNames && queueNames.length > 0 ?
                queueNames.map(queueKey =>
                  <DashboardSection key={queueKey} title={extractQueueName(queueKey)}>
                    <ChartWithLegend  snapshot={snapshot}
                                      timeframe={timeframe}
                                      height={chartHeight}
                                      margins={{
                                        left: 80
                                      }}
                                      y1={{
                                          metrics: queueMetricsMessagesSent(queueKey),
                                          labels: [ 'Published messages', 'Publish rate', 'Delivered messages',
                                                   'Deliver rate', 'Acknowledged messages', 'Acknowledge rate' ],
                                          type: 'line'
                                      }}/>
                    <ChartWithLegend  snapshot={snapshot}
                                      timeframe={timeframe}
                                      height={chartHeight}
                                      margins={{
                                        left: 80
                                      }}
                                      y1={{
                                          metrics: queueMetricsMessagesQueued(queueKey),
                                          labels: [ 'Messages ready', 'Messages ready rate',
                                                    'Messages unacknowledged', 'Unacknowledged rate',
                                                    'Messages total', 'Messages total rate' ],
                                          type: 'line'
                                      }}/>
                    <ChartWithLegend  snapshot={snapshot}
                                      timeframe={timeframe}
                                      height={chartHeight}
                                      margins={{
                                        left: 80
                                      }}
                                      y1={{
                                          metrics: [ 'queue_map.' + queueKey + '.consumers' ],
                                          labels: ['Consumers'],
                                          type: 'line'
                                      }}/>
                    <ChartWithLegend  snapshot={snapshot}
                                      timeframe={timeframe}
                                      height={chartHeight}
                                      margins={{
                                        left: 80
                                      }}
                                      y1={{
                                          formatter: bytesZeroDecimalPlaces,
                                          tooltipFormatter: bytesTwoDecimalPlaces,
                                          metrics: [ 'queue_map.' + queueKey + '.memory' ],
                                          labels: ['Memory use'],
                                          type: 'line'
                                      }}/>
                  </DashboardSection>
                )
              : null}
            </Collapsible.Content>
          </Collapsible>
        </DashboardSection>

        <DashboardSection title='Channels'>
          <ResponsiveTable>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {channelNames && channelNames.length > 0 ?
                channelNames.map(channelName =>
                <tr key={channelName}>
                  <td>{channelName}</td>
                </tr>
              )
              : null}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>

    </div>
  );
 }
});

export default RabbitMqDashboard;
