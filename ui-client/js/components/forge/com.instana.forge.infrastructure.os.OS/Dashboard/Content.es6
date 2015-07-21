'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatBytesShort,
  formatPercentageShort,
  formatNumberShort
} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import HelpLink from 'instana-ui-components/HelpLink';
import ChartWithLegend from '../../../sdk/charts/ChartWithLegend';
import Separator from '../../../sdk/Separator';
import Mtd from '../../../sdk/Mtd';
import ContentHeading from '../../../sdk/ContentHeading';

const rpt = React.PropTypes;

const bytesPerSecondFormatter = d => formatBytesShort(d) + '/s';
const kbFormatter = d => formatBytes(d * 1024);
const kbFormatterShort = d => formatBytesShort(d * 1024);

const chartHeight = 200;

const OsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  getInitialState() {
    return {
      filesystemName: null,
      interfaceName: null
    };
  },

  render() {
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);
    const interfaces = this.props.snapshot.getIn(['data', 'interfaces']);

    return (
      <div>
        <ContentHeading>CPU Usage</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 60
               }}
               y1={{
                 min: 0,
                 max: 1,
                 formatter: formatPercentageShort,
                 metrics: [
                   'cpu.total.user',
                   'cpu.total.sys',
                   'cpu.total.wait',
                   'cpu.total.nice',
                   'cpu.total.steal'
                 ],
                 labels: [
                   'User',
                   'System',
                   'Wait',
                   'Nice',
                   'Steal'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ContentHeading>CPU Load</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               y1={{
                 min: 0,
                 type: 'stackedArea',
                 metrics: [
                   'load.1min'
                 ],
                 labels: ['Load']
               }}/>

        <Separator />

        <ContentHeading>Memory Free</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 max: this.props.snapshot.getIn(['data', 'memory.total']),
                 formatter: formatBytesShort,
                 metrics: [
                   'memory.free'
                 ],
                 labels: ['Free'],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemName ?
          <div>
            <ChartWithLegend snapshot={this.props.snapshot}
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
                       'fs.' + this.state.filesystemName + '.free',
                       this.props.snapshot
                     ),
                     formatter: kbFormatterShort,
                     metrics: [
                       'fs.' + this.state.filesystemName + '.free',
                       'fs.' + this.state.filesystemName + '.leaked'
                     ],
                     labels: ['Free', 'Leaked'],
                     type: 'line'
                   }}

                   y2={{
                     min: 0,
                     max: getMaxValue(
                       'fs.' + this.state.filesystemName + '.ifree',
                       this.props.snapshot
                     ),
                     metrics: [
                       'fs.' + this.state.filesystemName + '.ifree'
                     ],
                     labels: ['iFree'],
                     type: 'line',
                     formatter: formatNumberShort
                   }}/>
          </div>
        : null}

        <table className='in-subtle-table in-subtle-table--clickable'>
          <thead>
            <tr>
              <th>Device</th>
              <th>Mount</th>
              <th>Options</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Free</th>
              <th>
                <HelpLink helpId='os.fs-leaked-metric'>
                  Leaked
                </HelpLink>
              </th>
              <th>iFree</th>
            </tr>
          </thead>

          <tbody>
            {filesystems.map((data, name) =>
              <tr key={name} onClick={() => this.selectFilesystem(name)}>
                <td>{name}</td>
                <td>{data.get('mount')}</td>
                <td>{data.get('options')}</td>
                <td>{data.get('systype')}</td>
                <td>{kbFormatter(data.get('capacity'))}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.free'
                       )}
                     formatter={kbFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.leaked'
                       )}
                     formatter={kbFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.ifree'
                       )}
                     formatter={formatNumberShort} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.networkinterfaces')}
        </ContentHeading>

        {this.state.interfaceName ?
          <div>
            <ChartWithLegend snapshot={this.props.snapshot}
                   windowSize={this.props.timeframe}

                   width={this.props.width}
                   height={chartHeight}
                   margins={{
                     left: 80,
                     right: 80
                   }}

                   y1={{
                     min: 0,
                     formatter: formatBytesShort,
                     metrics: [
                       'ifs.' + this.state.interfaceName + '.rx.bytes',
                       'ifs.' + this.state.interfaceName + '.tx.bytes'
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
                       'ifs.' + this.state.interfaceName + '.rx.errors',
                       'ifs.' + this.state.interfaceName + '.rx.dropped',
                       'ifs.' + this.state.interfaceName + '.rx.overruns',
                       'ifs.' + this.state.interfaceName + '.tx.errors',
                       'ifs.' + this.state.interfaceName + '.tx.dropped',
                       'ifs.' + this.state.interfaceName + '.tx.overruns'
                     ],
                     labels: [
                       'RX Errors',
                       'RX Dropped',
                       'RX Overruns',
                       'TX Errors',
                       'TX Dropped',
                       'TX Overruns'
                     ],
                     formatter: formatPercentageShort,
                     type: 'line'
                   }}/>
          </div>
        : null}

        <table className='in-subtle-table in-subtle-table--clickable'>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th colSpan='4'>Received (RX)</th>
              <th colSpan='4'>Transmitted (TX)</th>
            </tr>
            <tr>
              <th>Interface</th>
              <th>Mac</th>
              <th>IPs</th>

              <th style={{width: '10em'}}>Bytes</th>
              <th style={{width: '4em'}}>Errors</th>
              <th style={{width: '4em'}}>Dropped</th>
              <th style={{width: '4em'}}>Overruns</th>

              <th style={{width: '10em'}}>Bytes</th>
              <th style={{width: '4em'}}>Errors</th>
              <th style={{width: '4em'}}>Dropped</th>
              <th style={{width: '4em'}}>Overruns</th>
            </tr>
          </thead>

          <tbody>
            {interfaces.map((data, name) =>
              <tr key={name} onClick={() => this.selectInterface(name)}>
                <td>{name}</td>
                <td>{data.get('mac')}</td>
                <td>{data.get('ips').join(', ')}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.bytes'
                       )}
                     formatter={bytesPerSecondFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.errors'
                       )}
                     formatter={formatPercentageShort} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.dropped'
                       )}
                     formatter={formatPercentageShort} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.overruns'
                       )}
                     formatter={formatPercentageShort} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.bytes'
                       )}
                     formatter={bytesPerSecondFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.errors'
                       )}
                     formatter={formatPercentageShort} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.dropped'
                       )}
                     formatter={formatPercentageShort} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.overruns'
                       )}
                     formatter={formatPercentageShort} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />

        <ContentHeading>TCP Activity</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
                         width={this.props.width}
                         height={chartHeight}
                         y1={{
                           type: 'line',
                           metrics: [
                             'tcp.established',
                             'tcp.opens',
                             'tcp.inSegs',
                             'tcp.outSegs'
                           ],
                           labels: [
                             'Established',
                             'Opens',
                             'In Segments',
                             'Out Segments'
                           ],
                           formatter: formatNumberShort
                         }}
                         y2={{
                           type: 'line',
                           metrics: [
                             'tcp.resets',
                             'tcp.fails',
                             'tcp.errors',
                             'tcp.retrans'
                           ],
                           labels: [
                             'Reset',
                             'Fail',
                             'Error',
                             'Retransmission'
                           ],
                           min: 0,
                           max: 1,
                           formatter: formatPercentageShort
                         }}
                         margins={{
                           right: 60,
                           left: 80
                         }}/>

      </div>
    );
  },

  selectFilesystem(fs) {
    this.setState({
      filesystemName: fs
    });
  },

  selectInterface(iface) {
    this.setState({
      interfaceName: iface
    });
  },

  createMetricValueStream(metric) {
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }

});

export default OsDashboard;
