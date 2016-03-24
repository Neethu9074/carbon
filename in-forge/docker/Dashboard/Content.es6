import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const DockerDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const hasNetworkMetrics = snapshot.get('NetworkMode', '') === 'bridge';

    return (
      <div>
        <DashboardSection title='Memory'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 10
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'memory.active_anon',
                               'memory.active_file',
                               'memory.inactive_anon',
                               'memory.inactive_file'
                             ],
                             labels: [
                               'active_anon',
                               'active_file',
                               'inactive_anon',
                               'inactive_file'
                             ],
                             formatter: bytesTwoDecimalPlaces,
                             type: 'line'
                           }}/>
        </DashboardSection>
        { hasNetworkMetrics ?
        <DashboardSection title='Network'>
          <div>
            <ChartWithLegend snapshot={snapshot}
                   timeframe={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80,
                     right: 80
                   }}

                   y1={{
                     min: 0,
                     formatter: bytesZeroDecimalPlaces,
                     metrics: [
                       'network.rx.bytes',
                       'network.tx.bytes'
                     ],
                     labels: [
                       'Received',
                       'Transmitted'
                     ],
                     type: 'line'
                   }}
                   y2={{
                     min: 0,
                     max: 1,
                     metrics: [
                       'network.rx.errors',
                       'network.rx.dropped',
                       'network.tx.errors',
                       'network.tx.dropped'
                     ],
                     labels: [
                       'RX Errors',
                       'RX Dropped',
                       'TX Errors',
                       'TX Dropped'
                     ],
                     formatter: percentageZeroDecimalPlaces,
                     type: 'line'
                   }}/>
          </div>
        </DashboardSection>
        : null }
      </div>
    );
  }
});

export default DockerDashboard;
