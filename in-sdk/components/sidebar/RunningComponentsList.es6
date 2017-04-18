import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { getRunningComponents } from 'in-stores/snapshot';
import { emptySet } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshotIds: getRunningComponents(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  React.createClass({
    displayName: 'RunningComponentsList',

    mixins: [PureRenderMixin],

    propTypes: {
      snapshotIds: irpt.setOf(rpt.string)
    },

    render() {
      if (this.props.snapshotIds == null) {
        return null;
      }

      return <RelatedSnapshotList snapshotIds={this.props.snapshotIds} />;
    }
  })
);
