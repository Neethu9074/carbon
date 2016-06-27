import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';
import d3 from 'd3';

import KeyspacesTable from 'in-forge/plugins/cassandraNode/Dashboard/KeyspacesTable';
import {capitalize} from 'in-services/formatters/string';
import {muSecondsToMillisZeroDecimalPlaces} from 'in-services/formatters/number';
import {timeframeShape} from 'in-stores/timeline';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';


const chartHeight = 200;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';

const CassandraDashboard = React.createClass({
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
        <DashboardSection title='Requests'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'clientrequests.read.count',
                               'clientrequests.write.count'
                             ],
                             labels: [
                               'Read',
                               'Write'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        {['read', 'write'].map(op =>
          <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies'}
                            key={op}>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               formatter: muSecondsToMillisZeroDecimalPlaces,
                               metrics: [
                                 'clientrequests.' + op + '.mean',
                                 'clientrequests.' + op + '.50',
                                 'clientrequests.' + op + '.95',
                                 'clientrequests.' + op + '.99'
                               ],
                               labels: [
                                 'Mean',
                                 '50th Percentile',
                                 '95th Percentile',
                                 '99th Percentile'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>
        )}

        {['pending', 'blocked'].map(stage =>
          <DashboardSection title={capitalize(stage) + ' Requests in Threadpools (Stages)'}
                            key={stage}>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               metrics: [
                                 'stage.mutation.' + stage,
                                 'stage.read.' + stage,
                                 'stage.countermutation.' + stage,
                                 'stage.readrepair.' + stage,
                                 'stage.requestresponse.' + stage,
                                 'stage.memtableflushwriter.' + stage
                               ],
                               labels: [
                                 'Write (Mutation)',
                                 'Read',
                                 'Counter Mutation',
                                 'Read Repair',
                                 'Request/Response',
                                 'Memtable Flushwriter'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>
        )}

        <DashboardSection title='Dropped Messages'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'dropped.MUTATION',
                               'dropped.READ',
                               'dropped.COUNTER_MUTATION',
                               'dropped.READ_REPAIR',
                               'dropped.REQUEST_RESPONSE'
                             ],
                             labels: [
                               'Write (Mutation)',
                               'Read',
                               'Counter Mutation',
                               'Read Repair',
                               'Request/Response'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <KeyspacesTable snapshot={snapshot} timeframe={timeframe} />

        <DashboardSection title='Pending Compactions'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'compaction.pending'
                             ],
                             labels: [
                               'Compactions'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Cache Hits'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentFormatter,
                             metrics: [
                               'cache.counter.hit',
                               'cache.key.hit',
                               'cache.row.hit'
                             ],
                             labels: [
                               'Counter',
                               'Key',
                               'Row'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Bloom Filter'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentFormatter,
                             metrics: [
                               'bloomFilterFalse'
                             ],
                             labels: [
                               'Miss Rate'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  },

  selectKeyspace(keyspace) {
    this.setState({
      selectedKeyspace: keyspace
    });
  }
});

export default CassandraDashboard;
