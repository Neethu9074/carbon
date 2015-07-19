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

import Chart from '../../../sdk/charts/Chart';
import ChartLegend from '../../../sdk/charts/ChartLegendV2';
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

        <ChartLegend snapshot={this.props.snapshot}
                       y1={{
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
                         formatted: formatPercentageShort
                       }} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}

               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 60
               }}

               y1={{
                 min: 0,
                 max: 1,
                 tickFormatter: formatPercentageShort,
                 metrics: [
                   'cpu.total.user',
                   'cpu.total.sys',
                   'cpu.total.wait',
                   'cpu.total.nice',
                   'cpu.total.steal'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ContentHeading>CPU Load</ContentHeading>
        <ChartLegend snapshot={this.props.snapshot}
                       y1={{
                         metrics: ['load.1min'],
                         labels: ['Load']
                       }}/>
        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               y1={{
                 min: 0,
                 type: 'stackedArea',
                 metrics: [
                   'load.1min'
                 ]
               }}/>

        <Separator />

        <ContentHeading>Memory Free</ContentHeading>
        <ChartLegend snapshot={this.props.snapshot}
                       y1={{
                         metrics: ['memory.free'],
                         labels: ['Free'],
                         formatter: formatBytes
                       }}/>

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 max: this.props.snapshot.getIn(['data', 'memory.total']),
                 tickFormatter: formatBytesShort,
                 metrics: [
                   'memory.free'
                 ],
                 type: 'stackedArea'
               }}/>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemName ?
          <div>
            <ChartLegend snapshot={this.props.snapshot}
                           y1={{
                             formatter: kbFormatter,
                             metrics: [
                               'fs.' + this.state.filesystemName + '.free',
                               'fs.' + this.state.filesystemName + '.leaked'
                             ],
                             labels: ['Free', 'Leaked']
                           }}
                           y2={{
                             metrics: [
                               'fs.' + this.state.filesystemName + '.ifree'
                             ],
                             labels: ['iFree'],
                             formatter: formatNumberShort
                           }}/>

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
                       'fs.' + this.state.filesystemName + '.free',
                       this.props.snapshot
                     ),
                     tickFormatter: kbFormatterShort,
                     metrics: [
                       'fs.' + this.state.filesystemName + '.free',
                       'fs.' + this.state.filesystemName + '.leaked'
                     ],
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
                     type: 'line',
                     tickFormatter: formatNumberShort
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
              <th>Leaked</th>
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
            <ChartLegend snapshot={this.props.snapshot}
                           y1={{
                             metrics: [
                               'ifs.' + this.state.interfaceName + '.rx.bytes',
                               'ifs.' + this.state.interfaceName + '.tx.bytes'
                             ],
                             labels: [
                               'Received',
                               'Transmitted'
                             ],
                             formatter: formatBytes
                           }}
                           y2={{
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
                             formatter: formatPercentageShort
                           }}/>

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
                     tickFormatter: formatBytesShort,
                     metrics: [
                       'ifs.' + this.state.interfaceName + '.rx.bytes',
                       'ifs.' + this.state.interfaceName + '.tx.bytes'
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
                     tickFormatter: formatPercentageShort,
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
        <ChartLegend snapshot={this.props.snapshot}
                       y1={{
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
                         formatter: formatPercentageShort
                       }}/>

        <Chart snapshot={this.props.snapshot}
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
                 ]
               }}
               y2={{
                 type: 'line',
                 metrics: [
                   'tcp.resets',
                   'tcp.fails',
                   'tcp.errors',
                   'tcp.retrans'
                 ],
                 min: 0,
                 max: 1,
                 tickFormatter: formatPercentageShort
               }}
               margins={{
                 right: 60
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
