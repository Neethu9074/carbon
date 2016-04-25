import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import DashboardSection from 'in-components/DashboardSection';
import {timeframeShape} from 'in-stores/timeline';


export default React.createClass({

  displayName: 'ElasticsearchClusterDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    return (
      <div>
        <DashboardSection title='Cluster Nodes'>
          <ClusterNodesTable clusterSnapshotId={this.props.snapshot.get('id')}
                             timeframe={this.props.timeframe} />
        </DashboardSection>
      </div>
    );
  }
});
