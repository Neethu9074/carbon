import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const MySqlDashboard = React.createClass({
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
        <DashboardSection title='Clients'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'status.CONNECTIONS',
                               'status.MAX_USED_CONNECTIONS',
                               'status.ABORTED_CONNECTS'
                             ],
                             labels: [
                               'Connections',
                               'Max used connections',
                               'Aborted connects'
                             ],
                             type: 'line'
                         }}/>
        </DashboardSection>
        <DashboardSection title='Queries'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 60
                           }}
                           y1={{
                             metrics: [
                               'status.QUERIES'
                             ],
                             labels: [
                               'Queries'
                             ],
                             type: 'line'
                           }}
                           y2={{
                             metrics: [
                               'status.COM_SELECT',
                               'status.COM_UPDATE',
                               'status.COM_INSERT',
                               'status.COM_DELETE'
                             ],
                             labels: [
                               'SELECTS',
                               'UPDATES',
                               'INSERTS',
                               'DELETES'
                             ],
                             type: 'line'
                           }}/>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               metrics: [
                                 'status.SLOW_QUERIES',
                                 'status.COM_SHOW_ERRORS'
                               ],
                               labels: [
                                 'Slow Queries',
                                 'Errors'
                               ],
                               type: 'line'
                           }}/>
        </DashboardSection>
        <DashboardSection title='Key Access'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 60
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
