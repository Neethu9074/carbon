import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const HttpdDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Traffic'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   metrics: [
                     'requests'
                   ],
                   labels: [
                     'Requests'
                   ],
                   type: 'line'
                 }}
                 y2={{
                   metrics: [
                     'kBytes'
                   ],
                   labels: [
                     'kBytes'
                   ],
                   type: 'line'
                 }}
                 />
        </DashboardSection>
        <DashboardSection title='Worker'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 60
                           }}

                           y1={{
                             min: 0,
                             metrics: [
                               'worker.waiting',
                               'worker.starting',
                               'worker.reading',
                               'worker.writing',
                               'worker.keepalive',
                               'worker.dns',
                               'worker.closing',
                               'worker.logging',
                               'worker.graceful',
                               'worker.idle'
                             ],
                             labels: [
                               'Waiting',
                               'Starting',
                               'Reading',
                               'Writing',
                               'Keepalive',
                               'Dns',
                               'Closing',
                               'Logging',
                               'Graceful',
                               'Idle'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default HttpdDashboard;
