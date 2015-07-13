'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';

import Chart from '../../../sdk/charts/Chart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';

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
        <ChartLegend title='Storage Load'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'storage.load'
                     ]}
                     metricLabels={[
                       'Load'
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
                 max: this.props.snapshot.getIn(['data', 'storage.load']),
                 tickFormatter: formatBytes,
                 metrics: [
                   'storage.load'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ChartLegend title='Requests'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'requests.read',
                       'requests.write'
                     ]}
                     metricLabels={[
                       'Read',
                       'Write'
                     ]}
                     metricUnit=''
                     metricValueFormatter={percentFormatter} />

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
                   'requests.read',
                   'requests.write'
                 ],
                 type: 'line'
               }}/>

        <Separator />

        <ChartLegend title='Cache Hits'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'cache.counter.hit',
                       'cache.key.hit',
                       'cache.row.hit'
                     ]}
                     metricLabels={[
                       'Counter',
                       'Key',
                       'Row'
                     ]}
                     metricUnit=''
                     metricValueFormatter={percentFormatter} />

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
                 tickFormatter: percentFormatter,
                 metrics: [
                   'cache.counter.hit',
                   'cache.key.hit',
                   'cache.row.hit'
                 ],
                 type: 'line'
               }}/>

        <Separator />

        <ChartLegend title='Pending Requests'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'requests.countermutation.pending',
                       'requests.mutation.pending',
                       'requests.readrepair.pending',
                       'requests.read.pending',
                       'requests.requestresponse.pending'
                     ]}
                     metricLabels={[
                       'Counter Mutation',
                       'Mutation',
                       'Read Repair',
                       'Read',
                       'RequestResponse'
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
                   'requests.countermutation.pending',
                   'requests.mutation.pending',
                   'requests.readrepair.pending',
                   'requests.read.pending',
                   'requests.requestresponse.pending'
                 ],
                 type: 'line'
               }}/>

        <Separator />

        <ChartLegend title='Bloom Filter'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'bloomFilterFalse'
                     ]}
                     metricLabels={[
                       'Miss'
                     ]}
                     metricUnit=''
                     metricValueFormatter={percentFormatter} />

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
                 tickFormatter: percentFormatter,
                 metrics: [
                   'bloomFilterFalse'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ChartLegend title='Sorted Strings Tables'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'sstables'
                     ]}
                     metricLabels={[
                       'Tables'
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
                   'sstables'
                 ],
                 type: 'stackedArea'
               }}/>
      </div>
    );
  }

});

export default CassandraDashboard;
