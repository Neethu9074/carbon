import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import IndicesTable from 'in-forge/plugins/elasticsearchNode/Dashboard/IndicesTable.es6';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {
  zeroDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces
} from 'in-services/formatters/number';

import NodeSummary from '../NodeSummary.es6';

const chartHeight = 200;

const ElasticsearchDashboard = React.createClass({
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
      <DashboardSection title='Summary'>
      <NodeSummary snapshot={snapshot}/>
      </DashboardSection>
        <DashboardSection title='Total Documents'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'indices.document_count',
                               'indices.deleted_count'
                             ],
                             labels: [
                               'Documents',
                               'Deleted'
                             ],
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'line'
                           }}/>
        </DashboardSection>

        <IndicesTable snapshot={snapshot}
                      timeframe={timeframe} />

        <DashboardSection title='Refresh and Flush'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 80
                           }}
                           y1={{
                             metrics: [
                               'indices.refresh_count',
                               'indices.flush_count'
                             ],
                             labels: [
                               'Refresh Count',
                               'Flush Count'
                             ],
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'line'
                           }}
                           y2={{
                             metrics: [
                               'indices.refresh_time',
                               'indices.flush_time'
                             ],
                             labels: [
                               'Refresh Time',
                               'Flush Time'
                             ],
                             formatter: (d) => d / 1000 + ' s',
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Lucene Segments'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'indices.segment_count'
                             ],
                             labels: [
                               'Segments'
                             ],
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
        <DashboardSection title='Active Threads'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           maergins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'threads.search_active',
                               'threads.index_active',
                               'threads.bulk_active',
                               'threads.merge_active',
                               'threads.flush_active',
                               'threads.get_active',
                               'threads.management_active',
                               'threads.refresh_active'
                             ],
                             labels: [
                               'Search',
                               'Index',
                               'Bulk',
                               'Merge',
                               'Flush',
                               'Get',
                               'Management',
                               'Refresh'
                             ],
                             formatter: zeroDecimalPlaces,
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
        <DashboardSection title='Queued Threads'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           maergins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'threads.search_queue',
                               'threads.index_queue',
                               'threads.bulk_queue',
                               'threads.merge_queue',
                               'threads.flush_queue',
                               'threads.get_queue',
                               'threads.management_queue',
                               'threads.refresh_queue'
                             ],
                             labels: [
                               'Search',
                               'Index',
                               'Bulk',
                               'Merge',
                               'Flush',
                               'Get',
                               'Management',
                               'Refresh'
                             ],
                             formatter: zeroDecimalPlaces,
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default ElasticsearchDashboard;
