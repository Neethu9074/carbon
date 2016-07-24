import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import IndicesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/IndicesTable.es6';
import ClusterSummary from 'in-forge/plugins/elasticsearchCluster/ClusterSummary';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

export default function ElasticsearchClusterDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Summary'>
        <ClusterSummary snapshot={snapshot}/>
      </DashboardSection>

      <DashboardSection title='Search Performance vs. Throughput'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: msZeroDecimalPlaces,
                           tooltipFormatter: msTwoDecimalPlaces,
                           metrics: [
                             'query_latency'
                           ],
                           labels: [
                             'Latency'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           formatter: withSiPrefixZeroDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
                           metrics: [
                             'query_count'
                           ],
                           labels: [
                             'Number Of Queries'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>

      <TwoColumnRow>
        <DashboardSection title='Indices'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: withSiPrefixZeroDecimalPlaces,
                             tooltipFormatter: twoDecimalPlaces,
                             metrics: [
                               'indices_count'
                             ],
                             labels: [
                               'Indices'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
        <DashboardSection title='Shards'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: withSiPrefixThreeDecimalPlaces,
                             tooltipFormatter: twoDecimalPlaces,
                             metrics: [
                               'active_shards',
                               'active_primaryshards',
                               'initializing_shards',
                               'relocating_shards',
                               'unassigned_shards'
                             ],
                             labels: [
                               'Active',
                               'Active Primary',
                               'Initializing',
                               'Relocating',
                               'Unassinged'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title='Documents'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80,
                           right: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: withSiPrefixThreeDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
                           metrics: [
                             'document_count'
                           ],
                           labels: [
                             'Overall Documents'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           min: 0,
                           formatter: withSiPrefixThreeDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces,
                           metrics: [
                             'index_count',
                             'deleted_count'
                           ],
                           labels: [
                             'Added',
                             'Removed'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>

      <DashboardSection title='Cluster Nodes'>
        <ClusterNodesTable clusterSnapshotId={snapshot.get('id')}
                           timeframe={timeframe} />
      </DashboardSection>

      <IndicesTable snapshot={snapshot}
                    timeframe={timeframe} />
    </div>
  );
}

ElasticsearchClusterDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
