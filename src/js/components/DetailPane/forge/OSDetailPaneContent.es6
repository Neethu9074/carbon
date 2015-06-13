'use strict';

import React from 'react/addons';
import d3 from 'd3';

import StackedAreaChart from '../sdk/charts/StackedAreaChart';
import Separator from '../sdk/Separator';

const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);

const OSDetailPaneContent = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
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
      </div>
    );
  }
});

export default OSDetailPaneContent;
