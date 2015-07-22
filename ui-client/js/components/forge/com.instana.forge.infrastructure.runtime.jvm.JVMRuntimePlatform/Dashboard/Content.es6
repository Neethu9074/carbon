'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import ChartWithLegend from '../../../sdk/charts/ChartWithLegend';
import Separator from '../../../sdk/Separator';
import ContentHeading from '../../../sdk/ContentHeading';
import Mtd from '../../../sdk/Mtd';

const rpt = React.PropTypes;

const chartHeight = 300;

const JVMDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  getInitialState() {
    return {
      poolName: null,
      collectorName: null
    };
  },

  render() {
    const pools = this.props.snapshot.getIn(['data', 'jvm.pools']);
    const collectors = this.props.snapshot.getIn(['data', 'jvm.collectors']);
    return (
      <div>
        <ContentHeading>Threads</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
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
                             'threads.timed-waiting',
                             'threads.waiting',
                             'threads.blocked',
                             'threads.terminated'
                           ],
                           labels: [
                             'New',
                             'Runnable',
                             'Timed-Waiting',
                             'Waiting',
                             'Blocked',
                             'Terminated'
                           ],
                           type: 'stackedArea'
                         }}/>

        <Separator />

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
                           max: this.props.snapshot.getIn(['data', 'memory.max']),
                           formatter: formatBytes,
                           metrics: [
                             'memory.free'
                           ],
                           labels: [
                             'Free'
                           ],
                           type: 'stackedArea'
                         }}/>

        <Separator />

        <ContentHeading>Memory Pools</ContentHeading>

        {this.state.poolName ?
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}

                 width={this.props.width}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}

                 y1={{
                   min: 0,
                   max: getMaxValue(
                     'pools.' + this.state.poolName,
                     this.props.snapshot
                   ),
                   formatter: formatBytes,
                   metrics: [
                     'pools.' + this.state.poolName
                   ],
                   labels: [
                     this.state.poolName + ' Usage'
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
                <td>{formatBytes(data.get('initial'))}</td>
                <td>{formatBytes(data.get('max'))}</td>
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

        <Separator />

        <ContentHeading>Garbage Collection</ContentHeading>

        {this.state.collectorName ?
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}

                 width={this.props.width}
                 height={chartHeight}
                 margins={{
                   left: 80,
                   right: 80
                 }}

                 y1={{
                   metrics: [
                     'gc.' + this.state.collectorName + '.time'
                   ],
                   labels: [
                     this.state.collectorName + ' Time'
                   ],
                   type: 'line',
                   formatter: (d) => d / 1000 + ' s'
                   }}

                 y2={{
                   metrics: [
                     'gc.' + this.state.collectorName + '.inv'
                   ],
                   labels: [
                     this.state.collectorName + ' Invocations'
                   ],
                   type: 'line'
                 }}/>
        : null}

        <table className='in-subtle-table in-subtle-table--clickable'>
          <thead>
            <tr>
              <th>Collector</th>
              <th>Invocations</th>
              <th>Time spent</th>
            </tr>
          </thead>

          <tbody>
            {collectors.map((name) =>
              <tr key={name} onClick={() => this.selectCollector(name)}>
                <td>{name}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'gc.' + name + '.inv'
                       )} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'gc.' + name + '.time'
                       )} />
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

  selectCollector(collector) {
    this.setState({
      collectorName: collector
    });
  },

  createMetricValueStream(metric) {
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }
});

export default JVMDashboard;
