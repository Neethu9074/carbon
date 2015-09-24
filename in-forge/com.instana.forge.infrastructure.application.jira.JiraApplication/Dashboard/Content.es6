import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const JiraDashboard = React.createClass({
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
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
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
