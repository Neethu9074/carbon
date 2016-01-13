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
                             'waitstats.CXPACKET.wait_time_ms'
                           ],
                           labels: [
                             'Page IO-Latch SH',
                             'Page IO-Latch EX',
                             'CX-Packet'
                           ],
                           type: 'line'
                       }}/>
      </DashboardSection>
      </div>
    );
  }
});

export default MsSqlDashboard;
