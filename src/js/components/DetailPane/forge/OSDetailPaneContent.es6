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
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);

const OSDetailPaneContent = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  getInitialState() {
    return {filesystemDatasources: null};
  },

  render() {
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);

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
                          yAxisTickFormatter={yAxisTickFormatter}
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
                          yAxisTickFormatter={d => d}
                          metricValueFormatter={d => d} />

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemDatasources ?
          <LineChart datasources={this.state.filesystemDatasources}
                     width={this.props.width}
                     height={250}
                     yAxisTickFormatter={d => formatBytes(d * 1024)}
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
                <Mtd createMetricValueStream={this.createFsMetricValueStream.bind(this, name)}
                     formatter={d => formatBytes(d * 1024)} />
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
        this.createFsMetricWithHistoryStream(fs)
      ]
    });
  },

  createFsMetricWithHistoryStream(fs) {
    const metric = 'fs.' + fs + '.free.5000.mean';
    return create(MetricWithHistoryConveyer, {
      snapshot: this.props.snapshot,
      timeframe: 1000 * 60 * 5,
      metric
    });
  },

  createFsMetricValueStream(fs) {
    const metric = 'fs.' + fs + '.free.5000.mean';
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }
});

export default OSDetailPaneContent;
