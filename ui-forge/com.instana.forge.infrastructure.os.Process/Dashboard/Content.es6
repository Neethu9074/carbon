'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';

import Chart from 'instana-ui-components/Chart';
import ChartLegend from 'instana-ui-components/ChartLegend';

const rpt = React.PropTypes;

const chartHeight = 300;

const ProcessDashboard = React.createClass({
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
                       'mem.virtual',
                       'mem.resident',
                       'mem.share'
                     ]}
                     metricLabels={[
                       'Virtual',
                       'Resident',
                       'Share'
                     ]}
                     metricUnit=''
                     metricValueFormatter={formatBytes} />

        <Chart snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               width={this.props.width}
               height={chartHeight}
               margins={{
                 left: 80
               }}
               y1={{
                 min: 0,
                 formatter: formatBytes,
                 metrics: [
                   'mem.virtual',
                   'mem.resident',
                   'mem.share'
                 ],
                 type: 'line'
               }}/>

      </div>
    );
  }

});

export default ProcessDashboard;
