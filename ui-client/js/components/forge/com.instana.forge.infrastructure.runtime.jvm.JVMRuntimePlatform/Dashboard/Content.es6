'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import Chart from '../../../sdk/charts/Chart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';
import ContentHeading from '../../../sdk/ContentHeading';
import Mtd from '../../../sdk/Mtd';

const rpt = React.PropTypes;

const chartHeight = 300;

const CassandraDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  getInitialState() {
    return {
      poolName: null
    };
  },

  render() {
    const pools = this.props.snapshot.getIn(['data', 'jvm.pools']);
    return (
      <div>
        <ChartLegend title='Threads'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'threads.new',
                       'threads.runnable',
                       'threads.timed-wait',
                       'threads.waiting',
                       'threads.blocked',
                       'threads.terminated'
                     ]}
                     metricLabels={[
                       'New',
                       'Runnable',
                       'Timed-Wait',
                       'Waiting',
                       'Blocked',
                       'Terminated'
                     ]}
                     metricValueFormatter={d => d} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}

               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 60
               }}

               y1={{
                 min: 0,
                 metrics: [
                   'threads.new',
                   'threads.runnable',
                   'threads.timed-wait',
                   'threads.waiting',
                   'threads.blocked',
                   'threads.terminated'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ChartLegend title='Memory Free'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'memory.free'
                     ]}
                     metricLabels={[
                       'free'
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
                 max: this.props.snapshot.getIn(['data', 'memory.max']),
                 tickFormatter: formatBytes,
                 metrics: [
                   'memory.free'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ContentHeading>
          Memory Pools
        </ContentHeading>

        {this.state.poolName ?
          <Chart snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}

                 width={this.props.width}
                 height={chartHeight}
                 margins={{
                   left: 80,
                   right: 80
                 }}

                 y1={{
                   min: 0,
                   max: getMaxValue(
                     'jvm.pools.' + this.state.poolName + '.max',
                     this.props.snapshot
                   ),
                   tickFormatter: formatBytes(),
                   metrics: [
                     'pools.' + this.state.poolName
                   ],
                   type: 'line'
                 }}/>
        : null}

        <table className='in-subtle-table in-subtle-table--clickable'>
          <thead>
            <tr>
              <th>Pool</th>
              <th>Initial</th>
              <th>Max</th>
              <th>Used</th>
            </tr>
          </thead>

          <tbody>
            {pools.map((data, name) =>
              <tr key={name} onClick={() => this.selectPool(name)}>
                <td>{name}</td>
                <td>{data.get('initial')}</td>
                <td>{data.get('max')}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'pools.' + name
                       )}
                     formatter={formatBytes} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>
      </div>
    );
  },

  selectPool(pool) {
    this.setState({
      poolName: pool
    });
  },

  createMetricValueStream(metric) {
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }
});

export default CassandraDashboard;
