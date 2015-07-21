'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatPercentageShort
} from 'instana-ui-services/converters';

import Chart from '../../../sdk/charts/Chart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';

const rpt = React.PropTypes;

const chartHeight = 300;

const RedisDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <ChartLegend title='Clients'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'connected_clients',
                       'blocked_clients'
                     ]}
                     metricLabels={[
                       'Connected',
                       'Blocked'
                     ]}
                     metricUnit=''
                     metricValueFormatter={d => d} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 metrics: [
                   'connected_clients',
                   'blocked_clients'
                 ],
                 type: 'line'
               }}/>

        <Separator/>

        <ChartLegend title='Memory'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'used_memory'
                     ]}
                     metricLabels={[
                       'Used'
                     ]}
                     metricUnit=''
                     metricValueFormatter={formatBytes} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 formatter: formatBytes,
                 metrics: [
                   'used_memory'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator/>

        <ChartLegend title='Cache'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'hit_rate'
                     ]}
                     metricLabels={[
                       'Hit Rate'
                     ]}
                     metricUnit=''
                     metricValueFormatter={formatPercentageShort} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 max: 1,
                 formatter: formatPercentageShort,
                 metrics: [
                   'hit_rate'
                 ],
                 type: 'stackedArea'
               }}/>

      </div>
    );
  }

});

export default RedisDashboard;
