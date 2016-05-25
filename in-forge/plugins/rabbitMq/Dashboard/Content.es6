import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

const chartHeight = 200;

function extractNodeName(nodeKey) {
  return nodeKey;
}

function extractQueueName(queueKey) {
  return queueKey;
}

const RabbitMqDashboard = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedNode: null,
      selectedQueue: null
    };
  },

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const nodeNames = data.get('nodes', emptyList).toArray();
    nodeNames.sort();
    const queueNames = data.get('queues', emptyList).toArray();
    queueNames.sort();
    const channelNames = data.get('channels', emptyList).toArray();
    channelNames.sort();

    return (
      <div>
        <DashboardSection title='Messages'>
          <Row>
            <Col cols={6}>
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
            </Col>
            <Col cols={6}>
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
                      min: 0,
                      max: 1,
                      formatter: percentageZeroDecimalPlaces
                    }}/>
            </Col>
          </Row>

          <Row>
            <Col cols={6}>
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
            </Col>
            <Col cols={6}>
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
                      min: 0,
                      max: 1,
                      formatter: percentageZeroDecimalPlaces
                    }}/>
            </Col>
          </Row>
        </DashboardSection>

        <DashboardSection title='Overview'>
          <ChartWithLegend  snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
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

        {nodeNames && nodeNames.length > 0 ?
          <DashboardSection title='Nodes'>
            {this.state.selectedNode != null ?
              <Row>
                <Col cols={6}>
                  <ChartWithLegend snapshot={snapshot}
                        timeframe={timeframe}
                        height={chartHeight}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          metrics: [
                            'node_map.' + this.state.selectedNode + '.fd_used',
                            'node_map.' + this.state.selectedNode + '.fd_total'
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
                            'node_map.' + this.state.selectedNode + '.mem_used',
                            'node_map.' + this.state.selectedNode + '.mem_limit'
                          ],
                          labels: [
                            'Used memory',
                            'Memory limit'
                          ],
                          type: 'line'
                        }}/>
                </Col>
                <Col cols={6}>
                  <ChartWithLegend snapshot={snapshot}
                        timeframe={timeframe}
                        height={chartHeight}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          metrics: [
                            'node_map.' + this.state.selectedNode + '.proc_used',
                            'node_map.' + this.state.selectedNode + '.proc_total'
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
                            'node_map.' + this.state.selectedNode + '.disk_free',
                            'node_map.' + this.state.selectedNode + '.disk_free_limit'
                          ],
                          labels: [
                            'Disk alarm threshold',
                            'Disk free space in bytes'
                          ],
                          type: 'line'
                        }}/>
                </Col>
              </Row>
            : null}

            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Node</th>
                </tr>
              </thead>

              <tbody>
                {nodeNames.map(nodeName =>
                  <tr key={nodeName}
                      onClick={() => this.setState({selectedNode: nodeName})}>
                    <td>{extractNodeName(nodeName)}</td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : 0}


        {queueNames && queueNames.length > 0 ?
          <DashboardSection title='Queues'>
            {this.state.selectedQueue != null ?
              <div>
                <Row>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + this.state.selectedQueue + '.publish',
                              'queue_map.' + this.state.selectedQueue + '.deliver',
                              'queue_map.' + this.state.selectedQueue + '.ack'
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
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + this.state.selectedQueue + '.publish_rate',
                              'queue_map.' + this.state.selectedQueue + '.deliver_rate',
                              'queue_map.' + this.state.selectedQueue + '.ack_rate'
                            ],
                            labels: [
                              'Publish rate',
                              'Deliver rate',
                              'Acknowledge rate'
                            ],
                            type: 'line',
                            min: 0,
                            max: 1,
                            formatter: percentageZeroDecimalPlaces
                          }}/>
                  </Col>
                </Row>


                <Row>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + this.state.selectedQueue + '.messages_ready',
                              'queue_map.' + this.state.selectedQueue + '.messages_unacknowledged',
                              'queue_map.' + this.state.selectedQueue + '.messages'
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
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + this.state.selectedQueue + '.messages_ready_rate',
                              'queue_map.' + this.state.selectedQueue + '.messages_unacknowledged_rate',
                              'queue_map.' + this.state.selectedQueue + '.messages_rate'
                            ],
                            labels: [
                              'Messages ready rate',
                              'Unacknowledged rate',
                              'Messages total rate'
                            ],
                            type: 'line',
                            min: 0,
                            max: 1,
                            formatter: percentageZeroDecimalPlaces
                          }}/>
                  </Col>
                </Row>


                <Row>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                          timeframe={timeframe}
                          height={chartHeight}
                          margins={{
                            left: 80
                          }}
                          y1={{
                            metrics: [
                              'queue_map.' + this.state.selectedQueue + '.consumers'
                            ],
                            labels: [
                              'Consumers'
                            ],
                            type: 'line'
                          }}/>
                  </Col>
                  <Col cols={6}>
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
                              'queue_map.' + this.state.selectedQueue + '.memory'
                            ],
                            labels: [
                              'Memory use'
                            ],
                            type: 'line'
                          }}/>
                  </Col>
                </Row>
              </div>
            : null}

            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Node</th>
                </tr>
              </thead>

              <tbody>
                {queueNames.map(queueName =>
                  <tr key={queueName}
                      onClick={() => this.setState({selectedQueue: queueName})}>
                    <td>{extractQueueName(queueName)}</td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : 0}


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
