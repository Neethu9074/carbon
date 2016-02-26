import React from 'react';
import irpt from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getDeployedUnits} from 'in-stores/snapshot';
import {emptySet} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import RelatedSnapshotList from './RelatedSnapshotList';

export default connectTo(
  props => {
    return {
      snapshotIds: getDeployedUnits(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying deployed units for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  React.createClass({
  displayName: 'DeployedUnitList',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    snapshotIds: irpt.setOf(React.PropTypes.string)
  },

  render() {
    if (this.props.snapshotIds == null) {
      return null;
    }

    return <RelatedSnapshotList snapshotIds={this.props.snapshotIds} />;
  }
}));
