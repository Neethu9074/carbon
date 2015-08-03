'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 300;

const ProcessDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Memory'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
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
                   labels: [
                     'Virtual',
                     'Resident',
                     'Share'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default ProcessDashboard;
