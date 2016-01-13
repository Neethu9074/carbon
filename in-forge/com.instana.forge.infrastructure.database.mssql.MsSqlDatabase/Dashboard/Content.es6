import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;
const chartHeight = 200;
const MsSqlDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
      <DashboardSection title='Wait-Times (ms) on server'>
        <ChartWithLegend snapshot={snapshot}
                         windowSize={timeframe}
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
        <ChartWithLegend snapshot={snapshot}
                         windowSize={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'perfcounters.sqlserver:general statistics\\logins\/sec',
                             'perfcounters.sqlserver:general statistics\\user connections'
                           ],
                           labels: [
                             'Logins/sec.',
                             'Connections'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      </div>
    );
  }
});

export default MsSqlDashboard;
