import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const NginxDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Requests'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={200}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   min: 0,
                   metrics: [
                     'requests'
                   ],
                   labels: [
                     'Requests'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>

        <DashboardSection title='Connections'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={200}
                 margins={{
                   left: 80,
                   right: 80
                 }}
                 y1={{
                   min: 0,
                   metrics: [
                     'connections.accepted',
                     'connections.handled'
                   ],
                   labels: [
                     'Accepted connections',
                     'Handled connections'
                   ],
                   type: 'line'
                 }}
                 y2={{
                   min: 0,
                   metrics: [
                     'connections.reading',
                     'connections.writing',
                     'connections.waiting'
                   ],
                   labels: [
                     'Reading',
                     'Writing',
                     'waiting'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default NginxDashboard;
