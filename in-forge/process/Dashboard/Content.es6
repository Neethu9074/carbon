import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const ProcessDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.object.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Memory'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   min: 0,
                   formatter: bytesTwoDecimalPlaces,
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
        <DashboardSection title='CPU Usage'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   metrics: [
                     'cpu.user',
                     'cpu.sys'
                   ],
                   labels: [
                     'User',
                     'System'
                   ],
                   formatter: percentageZeroDecimalPlaces,
                   type: 'stackedArea'
                 }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default ProcessDashboard;
