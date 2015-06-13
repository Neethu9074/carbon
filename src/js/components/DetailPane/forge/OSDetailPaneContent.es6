'use strict';

import React from 'react/addons';
import d3 from 'd3';

import StackedAreaChart from '../sdk/charts/StackedAreaChart';

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
                          height={300}
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
                          yAxisTickFormatter={yAxisTickFormatter}
                          metricValueFormatter={metricValueFormatter} />
      </div>
    );
  }
});

export default OSDetailPaneContent;
