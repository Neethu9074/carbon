'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import Chart from '../../../sdk/charts/Chart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';
import Mtd from '../../../sdk/Mtd';
import ContentHeading from '../../../sdk/ContentHeading';

const rpt = React.PropTypes;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);
const bytesPerSecondFormatter = d => formatBytes(d) + '/s';
const kbFormatter = d => formatBytes(d * 1024);

const chartHeight = 300;

const OsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  getInitialState() {
    return {
      filesystemMetrics: null,
      interfaceMetrics: null
    };
  },

  render() {
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);
    const interfaces = this.props.snapshot.getIn(['data', 'interfaces']);

    return (
      <div>
        <ChartLegend title='CPU Usage'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'cpu.total.user',
                       'cpu.total.sys',
                       'cpu.total.wait',
                       'cpu.total.nice',
                       'cpu.total.steal'
                     ]}
                     metricLabels={[
                       'User',
                       'System',
                       'Wait',
                       'Nice',
                       'Steal'
                     ]}
                     metricUnit='%'
                     metricValueFormatter={metricValueFormatter} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'cpu.total.user',
                 'cpu.total.sys',
                 'cpu.total.wait',
                 'cpu.total.nice',
                 'cpu.total.steal'
               ]}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 60
               }}
               yAxis={{
                 min: 0,
                 max: 1,
                 tickFormatter: percentFormatter
               }}/>

        <Separator />

        <ChartLegend title='CPU Load'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'load.1min'
                     ]}
                     metricLabels={[
                       'Load'
                     ]}
                     metricUnit=''
                     metricValueFormatter={d => d} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'load.1min'
               ]}
               width={this.props.width}
               height={chartHeight}
               yAxis={{
                 min: 0
               }}/>

        <Separator />

        <ChartLegend title='Memory Free'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'memory.free'
                     ]}
                     metricLabels={[
                       'Free'
                     ]}
                     metricUnit=''
                     metricValueFormatter={d => formatBytes(d)} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'memory.free'
               ]}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               yAxis={{
                 min: 0,
                 max: this.props.snapshot.getIn(['data', 'memory.total']),
                 tickFormatter: formatBytes
               }}/>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemMetrics ?
          <Chart type='line'
                 snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 metrics={this.state.filesystemMetrics}
                 width={this.props.width}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 yAxis={{
                   min: 0,
                   max: getMaxValue(
                     this.state.filesystemMetrics[0],
                     this.props.snapshot
                   ),
                   tickFormatter: kbFormatter
                 }}/>
        : null}

        <table className='in-subtle-table'>
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
                     formatter={commasFormatter} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.networkinterfaces')}
        </ContentHeading>

        {this.state.interfaceMetrics ?
          <Chart type='line'
                 snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 metrics={this.state.interfaceMetrics}
                 width={this.props.width}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 yAxis={{
                   min: 0,
                   tickFormatter: formatBytes
                 }}/>
        : null}

        <table className='in-subtle-table'>
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
              <th>Bytes</th><th>Errors</th><th>Dropped</th><th>Overruns</th>
              <th>Bytes</th><th>Errors</th><th>Dropped</th><th>Overruns</th>
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
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.dropped'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.overruns'
                       )}
                     formatter={percentFormatter} />
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
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.dropped'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.overruns'
                       )}
                     formatter={percentFormatter} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />

        <ChartLegend title='TCP Activity'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'tcp.established',
                       'tcp.opens',
                       'tcp.resets',
                       'tcp.fails',
                       'tcp.inSegs',
                       'tcp.outSegs',
                       'tcp.errors',
                       'tcp.retrans'
                     ]}
                     metricLabels={[
                       'Open',
                       'Connects',
                       'Reset %',
                       'Fail %',
                       'In Segments',
                       'Out Segments',
                       'Error %',
                       'Retransmission %'
                     ]}
                     metricUnit=''
                     metricValueFormatter={d => d} />

        <Chart type='line'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'tcp.established',
                 'tcp.opens',
                 'tcp.resets',
                 'tcp.fails',
                 'tcp.inSegs',
                 'tcp.outSegs',
                 'tcp.errors',
                 'tcp.retrans'
               ]}
               width={this.props.width}
               height={chartHeight} />

      </div>
    );
  },

  selectFilesystem(fs) {
    const metric = 'fs.' + fs + '.free';
    this.setState({
      filesystemMetrics: [metric]
    });
  },

  selectInterface(iface) {
    this.setState({
      interfaceMetrics: [
        'ifs.' + iface + '.rx.bytes',
        'ifs.' + iface + '.tx.bytes'
      ]
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
