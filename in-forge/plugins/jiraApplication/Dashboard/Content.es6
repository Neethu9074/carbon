import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const JiraDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
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
                               'instruments.http.sessions'
                             ],
                             labels: [
                               'Current Sessions'
                             ],
                             type: 'line'
                           }}
                           y2={{
                             metrics: [
                               'instruments.concurrent.requests'
                             ],
                             labels: [
                               'Concurrent Requests'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
        <DashboardSection title='DB Pool'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'instruments.dbcp.numIdle'
                             ],
                             labels: [
                               'Idle Connections'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default JiraDashboard;
