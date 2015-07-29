'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatPercentageShort
} from 'in-services/converters';

import ContentHeading from 'in-components/ContentHeading';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Separator from 'in-components/Separator';

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
        <ContentHeading>Clients</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
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
                 labels: [
                   'Connected',
                   'Blocked'
                 ],
                 type: 'line'
               }}/>

        <Separator/>

        <ContentHeading>Memory</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
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
                 labels: [
                   'Used'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator/>

        <ContentHeading>Cache</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
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
                 labels: [
                   'Hit Rate'
                 ],
                 type: 'stackedArea'
               }}/>

      </div>
    );
  }

});

export default RedisDashboard;
