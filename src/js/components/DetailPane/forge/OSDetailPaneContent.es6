'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';

import LineChart from 'instana-ui-components/LineChart';
import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';

import StackedAreaChart from '../sdk/charts/StackedAreaChart';
import Separator from '../sdk/Separator';
import Mtd from '../sdk/Mtd';
import ContentHeading from '../sdk/ContentHeading';

const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);

const OSDetailPaneContent = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  getInitialState() {
    return {filesystemDatasources: null,
            interfaceDatasources: null};
  },

  render() {
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);
    const interfaces = this.props.snapshot.getIn(['data', 'interfaces']);

    return (
      <div>
        <StackedAreaChart title='CPU Usage'
                          width={this.props.width}
                          height={250}
                          snapshot={this.props.snapshot}
                          timeframe={1000 * 60 * 5}
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
                          percentFormatter={percentFormatter}
                          metricValueFormatter={metricValueFormatter} />

        <Separator />

        <StackedAreaChart title='CPU Load'
                          width={this.props.width}
                          height={250}
                          snapshot={this.props.snapshot}
                          timeframe={1000 * 60 * 5}
                          metrics={[
                            'load.1min'
                          ]}
                          metricLabels={[
                            'Load'
                          ]}
                          metricUnit=''
                          percentFormatter={d => d}
                          metricValueFormatter={d => d} />

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemDatasources ?
          <LineChart datasources={this.state.filesystemDatasources}
                     width={this.props.width}
                     height={250}
                     percentFormatter={d => formatBytes(d * 1024)}
                     type='line' />
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
                <td>{formatBytes(data.get('capacity') * 1024)}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.free.5000.mean'
                       )}
                     formatter={d => formatBytes(d * 1024)} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.ifree.5000.mean'
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

        {this.state.interfaceDatasources ?
          <LineChart datasources={this.state.interfaceDatasources}
                     width={this.props.width}
                     height={250}
                     percentFormatter={d => formatBytes(d) + "/s"}
                     type='line' />
        : null}

        <table className='in-subtle-table'>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th colSpan="4">Received (RX)</th>
              <th colSpan="4">Transmitted (TX)</th>
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
                         'ifs.' + name + '.rx.bytes.5000.mean'
                       )}
                     formatter={d => formatBytes(d * 1024) + '/s'} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.errors.5000.mean'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.dropped.5000.mean'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.overruns.5000.mean'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.bytes.5000.mean'
                       )}
                     formatter={d => formatBytes(d * 1024) + '/s'} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.errors.5000.mean'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.dropped.5000.mean'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.overruns.5000.mean'
                       )}
                     formatter={percentFormatter} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

      </div>
    );
  },

  selectFilesystem(fs) {
    this.setState({
      filesystemDatasources: [
        this.createMetricWithHistoryStream('fs.' + fs + '.free.5000.mean')
      ]
    });
  },

  selectInterface(fs) {
    this.setState({
      interfaceDatasources: [
        this.createMetricWithHistoryStream('ifs.' + fs + '.rx.bytes.5000.mean'),
        this.createMetricWithHistoryStream('ifs.' + fs + '.tx.bytes.5000.mean')
      ]
    });
  },

  createMetricWithHistoryStream(metric) {
    return create(MetricWithHistoryConveyer, {
      snapshot: this.props.snapshot,
      timeframe: 1000 * 60 * 5,
      metric
    });
  },

  createMetricValueStream(metric) {
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }

});

export default OSDetailPaneContent;
