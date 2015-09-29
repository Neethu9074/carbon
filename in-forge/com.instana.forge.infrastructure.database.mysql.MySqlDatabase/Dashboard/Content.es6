import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const MySqlDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Clients'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'status.CONNECTIONS'
                             ],
                             labels: [
                               'Connections'
                             ],
                             type: 'line'
                         }}/>
        </DashboardSection>
        <DashboardSection title='Slow Queries'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'status.SLOW_QUERIES'
                             ],
                             labels: [
                               'Slow Queries'
                             ],
                             type: 'line'
                         }}/>
        </DashboardSection>
        <DashboardSection title='Key Access'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'status.KEY_READ_REQUESTS',
                               'status.KEY_WRITE_REQUESTS'
                             ],
                             labels: [
                               'Read Requests',
                               'Write Requests'
                             ],
                             type: 'line'
                           }}
                           y2={{
                             metrics: [
                               'status.KEY_READS',
                               'status.KEY_WRITES'
                             ],
                             labels: [
                               'Reads',
                               'Writes'
                             ],
                             type: 'line'
                           }}
                           />
        </DashboardSection>
      </div>
    );
  }

});

export default MySqlDashboard;
