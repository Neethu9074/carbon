import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid';

import {
  twoDecimalPlaces
} from 'in-services/formatters/number';

const chartHeight = 200;


const RabbitMqDashboard = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
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
    const snapshotId = snapshot.get('id');

    return (
      <div>
        <DashboardSection title='Messages'>
          <Row>
            <Col cols={12}>
              <ChartWithLegend snapshotId={snapshotId}
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
                        'Published per 5 seconds',
                        'Delivered per 5 seconds',
                        'Acknowledged per 5 seconds'
                      ],
                      type: 'line',
                      formatter: twoDecimalPlaces
                    }}/>
            </Col>
          </Row>

          <Row>
            <Col cols={6}>
              <ChartWithLegend snapshotId={snapshotId}
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
              <ChartWithLegend snapshotId={snapshotId}
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
                      formatter: twoDecimalPlaces
                    }}/>
            </Col>
          </Row>
        </DashboardSection>

        <DashboardSection title='Overview'>
          <ChartWithLegend snapshotId={snapshotId}
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

        <NodesTable snapshot={snapshot}
                    timeframe={timeframe} />

        <QueuesTable snapshot={snapshot}
                     timeframe={timeframe} />

    </div>
  );
 }
});

export default RabbitMqDashboard;
