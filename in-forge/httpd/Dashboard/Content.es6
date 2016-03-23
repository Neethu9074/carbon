import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const HttpdDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.shape({
      windowSize: rpt.number.isRequired,
      to: rpt.number
    }),
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Traffic'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
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
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
