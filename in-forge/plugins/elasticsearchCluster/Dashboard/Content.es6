import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import {percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

export default React.createClass({

  displayName: 'ElasticsearchClusterDashboard',

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
        <DashboardSection title='Barchart'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{left: 60}}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentageZeroDecimalPlaces,
                             metrics: [
                               'cpu.user'
                             ],
                             labels: [
                               'DA_MÄTRIC'
                             ],
                             type: 'bar'
                           }}
          />
        </DashboardSection>

        <DashboardSection title='Cluster Nodes'>
          <ClusterNodesTable clusterSnapshotId={this.props.snapshot.get('id')}
                             timeframe={this.props.timeframe} />
        </DashboardSection>
      </div>
    );
  }
});
