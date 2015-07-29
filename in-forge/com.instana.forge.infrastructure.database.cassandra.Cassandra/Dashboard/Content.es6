'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';

import ContentHeading from 'in-components/ContentHeading';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Separator from 'in-components/Separator';

const rpt = React.PropTypes;

const chartHeight = 300;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';

const CassandraDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <ContentHeading>Storage Load</ContentHeading>

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
                             'storage.load'
                           ],
                           labels: [
                             'Load'
                           ],
                           type: 'stackedArea'
                         }}/>

        <Separator />

        <ContentHeading>Requests</ContentHeading>

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
                             'requests.read',
                             'requests.write'
                           ],
                           lables: [
                             'Read',
                             'Write'
                           ],
                           type: 'line'
                         }}/>

        <Separator />

        <ContentHeading>Cache Hits</ContentHeading>

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
                           formatter: percentFormatter,
                           metrics: [
                             'cache.counter.hit',
                             'cache.key.hit',
                             'cache.row.hit'
                           ],
                           labels: [
                             'Counter',
                             'Key',
                             'Row'
                           ],
                           type: 'line'
                         }}/>

        <Separator />

        <ContentHeading>Pending Requests</ContentHeading>

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
                             'requests.countermutation.pending',
                             'requests.mutation.pending',
                             'requests.readrepair.pending',
                             'requests.read.pending',
                             'requests.requestresponse.pending'
                           ],
                           labels: [
                             'Counter Mutation',
                             'Mutation',
                             'Read Repair',
                             'Read',
                             'RequestResponse'
                           ],
                           type: 'line'
                         }}/>

        <Separator />

        <ContentHeading>Bloom Filter</ContentHeading>

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
                           formatter: percentFormatter,
                           metrics: [
                             'bloomFilterFalse'
                           ],
                           labels: [
                             'Miss Rate'
                           ],
                           type: 'stackedArea'
                         }}/>

        <Separator />

        <ContentHeading>Sorted Strings Tables</ContentHeading>

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
                             'sstables'
                           ],
                           labels: [
                             'Tables'
                           ],
                           type: 'stackedArea'
                         }}/>
      </div>
    );
  }

});

export default CassandraDashboard;
