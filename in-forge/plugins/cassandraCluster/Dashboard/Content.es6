import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';
import ClusterNodesTable from 'in-forge/plugins/cassandraCluster/Dashboard/ClusterNodesTable';

export default React.createClass({

  displayName: 'CassandraClusterDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    nodes: irpt.setOf(React.PropTypes.string),
    timeframe: timeframeShape.isRequired
  },

  render() {
    return (
      <div>
        <ClusterNodesTable clusterSnapshotId={this.props.snapshot.get('id')}
                           timeframe={this.props.timeframe}/>
      </div>
    );
  }
});
