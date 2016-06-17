import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;
const MsSqlDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const allDatabases = snapshot.getIn(['data', 'databases'], emptyList).toArray();

    return (
      <div>
      <DashboardSection title='Wait-Times (ms) on server'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'waitstats.PAGEIOLATCH_EX.wait_time_ms',
                             'waitstats.PAGEIOLATCH_SH.wait_time_ms',
                             'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
                             'waitstats.CXPACKET.wait_time_ms',
                             'waitstats.WRITELOG.wait_time_ms'
                           ],
                           labels: [
                             'Page IO-Latch EX',
                             'Page IO-Latch SH',
                             'Async Network IO',
                             'CX-Packet',
                             'Writelog'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      <DashboardSection title='Connections & Users'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'perfcounters.sqlserver:general statistics\\\\user connections'
                           ],
                           labels: [
                             'Connections'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      <DashboardSection title='Databases'>
      <ResponsiveTable>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {
            allDatabases.map(database => <tr><td>{database}</td></tr>)
          }
        </tbody>
      </ResponsiveTable>
      </DashboardSection>
      </div>
    );
  }
});

export default MsSqlDashboard;
