import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  msZeroDecimalPlaces,
  muSecondsZeroDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import CustomMonitorsTable from 'in-forge/plugins/redis/Dashboard/CustomMonitorsTable';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {formatDateTime} from 'in-services/formatters/date';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


const chartHeight = 200;

const hitRateFormatter = d => d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d);
const persistenceFormater = d => d < 0 ? 'Not in progress' : d + 's';
const latencyFormatter = (d, threshold) => d < threshold ?
  'Less than ' + msZeroDecimalPlaces(threshold) :
  msZeroDecimalPlaces(d);

function getConnectionMetricsForRole(role) {
  return (role === 'master') ?
    [ 'connected_clients', 'blocked_clients', 'rejected_connections', 'master_connected_slaves']
    : [ 'connected_clients', 'blocked_clients', 'rejected_connections' ];
}

function getConnectionLabelsForRole(role) {
  return (role === 'master') ?
    [ 'Connected', 'Blocked', 'Rejected connections', 'Connected slaves' ]
    : [ 'Connected', 'Blocked', 'Rejected connections' ];
}

function dbKeysMetrics(dbNames) {
  const metrics = [];
  metrics.push(dbNames.map(name => 'db.' + name + '.count')[0]);
  metrics.push(dbNames.map(name => 'db.' + name + '.expires')[0]);
  return metrics;
}

function dbKeysLabels(dbNames) {
  const labels = [];
  labels.push(dbNames.map(name => name + ' Keys Count')[0]);
  labels.push(dbNames.map(name => name + ' Keys Expires')[0]);
  return labels;
}

function pubSubMetrics(channelNames) {
  return channelNames.map(name => 'pubsub_subscribers.' + name);
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

    getInitialState() {
      return {
        selectedMonitorMetric: null
      };
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;
      const data = snapshot.get('data');
      const latencyThreshold = snapshot.getIn(['data', 'latency_monitor_threshold']);
      const dbNames = data.get('dbs', emptyList).toArray();
      const channelNames = data.get('channels', emptyList).toArray();
      const role = data.get('role');

      return (
        <div>
          {latencyThreshold > 0 ?
            <DashboardSection title='Latency'>
              <ChartWithLegend snapshotId={snapshot.get('id')}
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
                                 formatter: latencyFormatter.bind(latencyThreshold),
                                 type: 'line'
                               }}/>
            </DashboardSection>
          : null }

          <DashboardSection title='Throughput'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
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

          <DashboardSection title='Key Hits/Misses'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                              left: 80
                            }}
                            y1={{
                              min: 0,
                                  metrics: [
                                'keyspace_hits',
                                'keyspace_misses'
                              ],
                                  labels: [
                                'Key Hits',
                                'Key Misses'
                              ],
                              type: 'line'
                            }}
                            y2={{
                              min: 0,
                              max: 1,
                              metrics: [ 'hit_rate' ],
                              labels: ['Hit Rate' ],
                              type: 'line',
                              formatter: hitRateFormatter
                            }}/>
          </DashboardSection>
          <DashboardSection title='Key Expired/Evicted'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
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
                               'Keys Expired',
                               'Keys Evicted'
                             ],
                             type: 'line'
                            }}/>
          </DashboardSection>
          {dbNames && dbNames.length > 0 ?
            <DashboardSection title='Database'>
                <ChartWithLegend snapshotId={snapshot.get('id')}
                                timeframe={timeframe}
                                height={chartHeight}
                                margins={{
                                  left: 80
                                }}
                                y1={{
                                  metrics: dbKeysMetrics(dbNames),
                                  labels: dbKeysLabels(dbNames),
                                  type: 'line'
                                }}/>
            </DashboardSection>
          : null}
          <DashboardSection title='Memory'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               formatter: bytesZeroDecimalPlaces,
                               tooltipFormatter: bytesTwoDecimalPlaces,
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
                               type: 'line'
                             }}/>
          </DashboardSection>
          <DashboardSection title='Connections'>
             <ChartWithLegend snapshot = {snapshot}
                              timeframe = {timeframe}
                              height = {chartHeight}
                              margins = {{
                                left: 80
                              }}
                              y1 = {{
                                min: 0,
                                metrics: getConnectionMetricsForRole(role),
                                labels: getConnectionLabelsForRole(role),
                                type: 'line'
                              }}/>
          </DashboardSection>
          {channelNames && channelNames.length > 0 ?
            <DashboardSection title='Pub/Sub'>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 80
                               }}
                               y1={{
                                 metrics: pubSubMetrics(channelNames),
                                 labels: channelNames,
                                 type: 'line'
                               }}
                               y2={{
                                 metrics: ['pubsub_subscribed_patterns'],
                                 labels: ['Subscribed patterns'],
                                 type: 'line'
                               }}/>
            </DashboardSection>
          : null}
          <DashboardSection title='Persistence'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               metrics: [
                                 'rdb_current_bgsave_time_sec',
                                 'aof_current_rewrite_time_sec'
                               ],
                               labels: [
                                 'Duration of current rdb save',
                                 'Duration of current aof log rewrite'
                               ],
                               formatter: persistenceFormater,
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
                    <tr key={slog.get('id')}>
                      <td>{slog.get('id')}</td>
                      <td>{formatDateTime(slog.get('timestamp'))}</td>
                      <td>{muSecondsZeroDecimalPlaces(slog.get('duration'))} </td>
                      <td>{slog.get('args').join(' ')}</td>
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}

          {role === 'slave' ?
            <DashboardSection title='Bytes left before syncing is complete'>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                            timeframe={timeframe}
                            height={chartHeight}
                            margins={{
                            left: 80,
                                right: 80
                            }}
                            y1={{
                                min: 0,
                                formatter: kiloBytesZeroDecimalPlaces,
                                tooltipFormatter: kiloBytesTwoDecimalPlaces,
                                metrics: [ 'master_sync_left_bytes' ],
                                labels: [ 'Bytes left before syncing is complete' ],
                                type: 'stackedArea'
                            }}/>
              </DashboardSection>
          : null}

          <CustomMonitorsTable snapshot={snapshot}
                               timeframe={timeframe} />

        </div>
      );
     }
   }
));
