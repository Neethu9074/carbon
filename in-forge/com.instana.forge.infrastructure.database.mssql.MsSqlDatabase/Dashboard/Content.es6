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
      <DashboardSection title='Waits (all databases)'>
        <ChartWithLegend snapshot={snapshot}
                         windowSize={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'status.PAGEIOLATCH_SH',
                             'status.PAGEIOLATCH_EX',
                             'status.CXPACKET'
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
