import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const MariaDbDashboard = React.createClass({
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
        <DashboardSection title='Clients'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
        <DashboardSection title='Aria Engine Properties'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'status.ARIA_PAGECACHE_READS',
                               'status.ARIA_PAGECACHE_WRITES'
                             ],
                             labels: [
                               'Pagecache Reads',
                               'Pagecache Writes'
                             ],
                             type: 'line'
                           }}
                           />
        </DashboardSection>

      </div>
    );
  }
});

export default MariaDbDashboard;
