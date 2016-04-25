import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardSection from 'in-components/DashboardSection';
import {timeframeShape} from 'in-stores/timeline';
import {
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';


export default React.createClass({

  displayName: 'ElasticsearchClusterDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const snapshot = this.props.snapshot;
    const timeframe = this.props.timeframe;

    return (
      <div>
        <DashboardSection title='Search Performance vs. Throughput'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={300}
                           margins={{
                             left: 60,
                             right: 60
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
                             formatter: zeroDecimalPlaces,
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

        <DashboardSection title='Cluster Nodes'>
          <ClusterNodesTable clusterSnapshotId={snapshot.get('id')}
                             timeframe={timeframe} />
        </DashboardSection>
      </div>
    );
  }
});
