import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {formatBytes} from 'in-services/converters';
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
    const allSites = snapshot.getIn(['data', 'allsites']).toArray();
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
                   metrics: allSites.map(site => 'siteperf.' + site + '.current_connections'),
                   labels: allSites,
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
                    metrics: allSites.map(site => 'siteperf.' + site + '.total_requests'),
                    labels: allSites,
                    type: 'line'
                  }}/>
         </div>
       : null}
        </DashboardSection>
        <DashboardSection title='I/O Stats'>
        {siteName ?
          <div>
            <ChartWithLegend snapshot={snapshot}
                   windowSize={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 60
                   }}
                   y1={{
                     min: 0,
                     formatter: formatBytes,
                     metrics: allSites.map(site => 'siteperf.' + site + '.bytes_sent')
                              .concat(allSites.map(site => 'siteperf.' + site + '.bytes_received')),
                     labels: allSites.map(site => site + ' out')
                             .concat(allSites.map(site => site + ' in')),
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
