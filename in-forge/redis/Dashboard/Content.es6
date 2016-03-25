import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  zeroDecimalPlaces,
  msZeroDecimalPlaces,
  timeByMicroTwoDecimalPlaces
} from 'in-services/formatters/number';
import {
  formatDateTime
} from 'in-services/formatters/date';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


const chartHeight = 200;

function formatUnixDateTime(seconds) {
  return formatDateTime(seconds * 1000);
}

export default connectTo(
  props => {
    return {
      slowLogs: getRawPayload(props.snapshot.get('id'), 'slow_logs')
    };
  },
  React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: timeframeShape,
      slowLogs: irpt.list
    },
    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;
      const latencyThreshold = snapshot.getIn(['data', 'latency_monitor_threshold']);
      const dbs = snapshot.getIn(['data', 'dbs']);

      return (
        <div>
          {dbs && dbs.size > 0 ?
            <DashboardSection title='Database Size'>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 80
                               }}
                               y1={{
                                 metrics: dbs.toArray().map(name => 'db.' + name),
                                 labels: dbs.toArray(),
                                 type: 'line'
                               }}/>
            </DashboardSection>
          : null}

          <DashboardSection title='Clients'>
            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               metrics: [
                                 'connected_clients',
                                 'blocked_clients',
                                 'rejected_connections'
                               ],
                               labels: [
                                 'Connected',
                                 'Blocked',
                                 'Rejected connections'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>

          <DashboardSection title='Performance'>
            {latencyThreshold > 0 ?
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 80
                               }}
                               y1={{
                                 min: latencyThreshold,
                                 metrics: [
                                   'latency_max'
                                 ],
                                 labels: [
                                   'Latency'
                                 ],
                                 formatter: d => {
                                   let formattedLatency;
                                   if (d < latencyThreshold) {
                                     formattedLatency = 'Less than ' + msZeroDecimalPlaces(latencyThreshold);
                                   } else {
                                     formattedLatency = msZeroDecimalPlaces(d);
                                   }
                                   return formattedLatency;
                                 },
                                 type: 'line'
                               }}/>
            : null}

            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               metrics: [
                                 'throughput'
                               ],
                               labels: [
                                 'Throughput (ops/sec)'
                               ],
                               formatter: zeroDecimalPlaces,
                               type: 'line'
                             }}/>
          </DashboardSection>

          <DashboardSection title='Memory'>
            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               formatter: bytesTwoDecimalPlaces,
                               metrics: [
                                 'used_memory',
                                 'used_memory_rss',
                                 'used_memory_lua'
                               ],
                               labels: [
                                 'Used',
                                 'Used rss',
                                 'Used lua'
                               ],
                               type: 'stackedArea'
                             }}/>
          </DashboardSection>

          <DashboardSection title='Cache'>
            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               max: 1,
                               formatter: percentageZeroDecimalPlaces,
                               metrics: [
                                 'hit_rate'
                               ],
                               labels: [
                                 'Hit Rate'
                               ],
                               type: 'stackedArea'
                             }}/>

            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               metrics: [
                                 'expired_keys',
                                 'evicted_keys'
                               ],
                               labels: [
                                 'Expired keys',
                                 'Evicted keys'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>

          {this.props.slowLogs && this.props.slowLogs.size > 0 ?
            <DashboardSection title='Slow logs'>
              <ResponsiveTable>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>time</th>
                    <th>duration</th>
                    <th>args</th>
                  </tr>
                </thead>

                <tbody>
                {this.props.slowLogs.toArray()
                  .sort((a, b) => a.get('timestamp') - b.get('timestamp'))
                  .map(slog =>
                    <tr>
                      <td>{slog.get('id')}</td>
                      <td>{formatUnixDateTime(slog.get('timestamp'))}</td>
                      <td>{timeByMicroTwoDecimalPlaces(slog.get('duration'))}</td>
                      <td>{slog.get('args').toArray().map(a => a + ' ')}</td>
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
           : null}

           <DashboardSection title='Config'>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>logfile</td>
                  <td>{snapshot.getIn(['data', 'logfile'])}</td>
                </tr>
                <tr>
                  <td>pidfile</td>
                  <td>{snapshot.getIn(['data', 'pidfile'])}</td>
                </tr>
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        </div>
      );
     }
   }
));
