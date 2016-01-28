import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;
const chartHeight = 200;
const MsIISDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },
  getInitialState() {
    return {
      siteName: 'eumapp'
    };
  },
  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const siteName = this.state.siteName;
    return (
      <div>
      <DashboardSection title='Connections'>
      {siteName ?
        <div>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   metrics: [
                     'siteperf.' + siteName + '.current_connections'
                   ],
                   labels: [
                     siteName
                   ],
                   type: 'line'
                 }}/>
        </div>
      : null}
       </DashboardSection>
       <DashboardSection title='Request Stats'>
       {siteName ?
         <div>
           <ChartWithLegend snapshot={snapshot}
                  windowSize={timeframe}
                  height={chartHeight}
                  margins={{
                    left: 60
                  }}
                  y1={{
                    metrics: [
                      'siteperf.' + siteName + '.total_requests'
                    ],
                    labels: [
                      siteName
                    ],
                    type: 'line'
                  }}/>
         </div>
       : null}
        </DashboardSection>
      </div>
    );
  }
});

export default MsIISDashboard;
