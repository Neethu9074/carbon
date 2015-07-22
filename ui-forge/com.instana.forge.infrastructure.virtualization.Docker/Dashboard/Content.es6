'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import Chart from 'instana-ui-components/Chart';
import ChartLegend from 'instana-ui-components/ChartLegend';

const rpt = React.PropTypes;

const chartHeight = 300;

const DockerDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <ChartLegend title='Memory'
                     snapshot={this.props.snapshot}
                     metrics={[
                       'memory.active_anon',
                       'memory.active_file',
                       'memory.inactive_anon',
                       'memory.inactive_file'
                     ]}
                     metricLabels={[
                       'active_anon',
                       'active_file',
                       'inactive_anon',
                       'inactive_file'
                     ]}
                     metricUnit=''
                     metricValueFormatter={d => d} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 metrics: [
                   'memory.active_anon',
                   'memory.active_file',
                   'memory.inactive_anon',
                   'memory.inactive_file'
                 ],
                 type: 'line'
               }}/>

      </div>
    );
  }

});

export default DockerDashboard;
