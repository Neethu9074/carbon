import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptySet} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import RelatedSnapshotList from './RelatedSnapshotList';

export default connectTo(
  props => {
    return {
      snapshotIds: getClusterMembers(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  React.createClass({
  displayName: 'ClusterMembersList',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotIds: irpt.setOf(React.PropTypes.string),
    snapshotId: React.PropTypes.string.isRequired
  },

  render() {
    if (this.props.snapshotIds == null) {
      return null;
    }

    return <RelatedSnapshotList snapshotIds={this.props.snapshotIds} />;
  }
}));
