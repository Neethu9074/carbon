import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterMembersList from 'in-components/ClusterMembersList';


export default React.createClass({

  displayName: 'NodejsClusterSidebar',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <ClusterMembersList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});
