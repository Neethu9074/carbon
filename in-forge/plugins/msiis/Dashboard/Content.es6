import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {emptyList} from 'in-services/fixedImmutables';
import classnames from 'in-services/util/classnames';
import {timeframeShape} from 'in-stores/timeline';
import Mtd from 'in-components/Mtd';


const chartHeight = 200;
const MsIISDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  getInitialState() {
    return {
      siteName: null
    };
  },

  selectWebsite(name) {
    this.setState({siteName: name});
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const allSites = snapshot.getIn(['data', 'allsites'], emptyList).toArray();
    const allPools = snapshot.getIn(['data', 'allpools'], emptyList).toArray();
    const siteName = this.state.siteName;
    return (
      <div>
      <DashboardSection title='Connections On All Sites'>
        <div>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
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
       </DashboardSection>
       <DashboardSection title='Total Requests On All Sites'>
         <div>
           <ChartWithLegend snapshot={snapshot}
                  timeframe={timeframe}
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
        </DashboardSection>
        <DashboardSection title='I/O Stats'>
        {siteName ?
          <div>
            <ChartWithLegend snapshot={snapshot}
                   timeframe={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 60
                   }}
                   y1={{
                     min: 0,
                     metrics: [
                       'siteperf.' + siteName + '.get_requests',
                       'siteperf.' + siteName + '.post_requests',
                       'siteperf.' + siteName + '.put_requests'
                     ],
                     labels: [
                       'GET Requests',
                       'POST Requests',
                       'PUT Requests'
                     ],
                     type: 'line'
                   }}
                   y2={{
                     min: 0,
                     formatter: bytesTwoDecimalPlaces,
                     metrics: [
                       'siteperf.' + siteName + '.bytes_sent',
                       'siteperf.' + siteName + '.bytes_received'
                     ],
                     labels: [
                       'Bytes sent',
                       'Bytes received'
                     ],
                     type: 'line'
                   }}/>
          </div>
        : null}
         </DashboardSection>
         <DashboardSection title='Web-Sites'>
         <ResponsiveTable clickable={true}>
           <thead>
             <tr>
               <th>Name</th>
               <th>Current Connections</th>
               <th>Requests</th>
               <th>GET Requests</th>
               <th>POST Requests</th>
               <th>PUT Requests</th>
             </tr>
           </thead>
           <tbody>
             {allSites.map(site =>
               <tr key={site} onClick={() => this.selectWebsite(site)}
               className={classnames({
                 'active': site === siteName
               })}>
                  <td>{site}</td>
                  <Mtd metric={'siteperf.' + site + '.current_connections'}
                  snapshot={snapshot}/>
                  <Mtd metric={'siteperf.' + site + '.total_requests'}
                  snapshot={snapshot}/>
                  <Mtd metric={'siteperf.' + site + '.get_requests'}
                  snapshot={snapshot}/>
                  <Mtd metric={'siteperf.' + site + '.post_requests'}
                  snapshot={snapshot}/>
                  <Mtd metric={'siteperf.' + site + '.put_requests'}
                  snapshot={snapshot}/>
             </tr>
             )}
           </tbody>
         </ResponsiveTable>
         </DashboardSection>
         <DashboardSection title='Application-Pools'>
         <ResponsiveTable clickable={true}>
           <thead>
             <tr>
               <th>Name</th>
               <th>ASP.NET Version</th>
             </tr>
           </thead>
           <tbody>
             {allPools.map(pool =>
               <tr key={pool}>
                 <td>{pool}</td>
                 <td>{snapshot.getIn(['data', 'iis.apppools', pool, 'runtimeversion'])}</td>
               </tr>
             )}
           </tbody>
         </ResponsiveTable>
         </DashboardSection>
         </div>
    );
  }
});

export default MsIISDashboard;
