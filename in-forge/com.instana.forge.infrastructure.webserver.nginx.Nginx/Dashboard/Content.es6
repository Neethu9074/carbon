import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const NginxDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Requests'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
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
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 height={200}
                 margins={{
                   left: 80,
                   right: 80
                 }}
                 y1={{
                   min: 0,
                   metrics: [
                     'accepts',
                     'handled'
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
                     'reading',
                     'writing',
                     'waiting'
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
