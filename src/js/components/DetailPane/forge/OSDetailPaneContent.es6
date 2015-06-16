'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';

import StackedAreaChart from '../sdk/charts/StackedAreaChart';
import Separator from '../sdk/Separator';
import Mtd from '../sdk/Mtd';
import ContentHeading from '../sdk/ContentHeading';

const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);

const OSDetailPaneContent = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

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
              <tr key={name}>
                <td>{name}</td>
                <td>{data.get('mount')}</td>
                <td>{data.get('options')}</td>
                <td>{data.get('systype')}</td>
                <td>{formatBytes(data.get('capacity') * 1024)}</td>
                <Mtd createMetricValueStream={this.createFsMetricValueStream.bind(this, name)} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>
      </div>
    );
  },

  createFsMetricValueStream(fs) {
    const metric = 'fs.' + fs + '.free.5000.mean';
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    })
    .map(kb => formatBytes(kb * 1024));
  }
});

export default OSDetailPaneContent;
