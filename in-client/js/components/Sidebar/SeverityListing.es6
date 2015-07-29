'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {isIdEqual} from 'in-services/util/snapshots';

import SnapshotList from './SnapshotList';

import './SeverityListing.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-severity-listing';

const SeverityListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: irpt.list.isRequired,
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map.isRequired,

    snapshotIssueSummary: irpt.map.isRequired,
    heading: rpt.string.isRequired,
    headingColor: rpt.string.isRequired
  },

  render() {
    const snapshots = this.getAllSnapshotsWithThisSeverity();

    return (
      <div className={block}>
        <h2 style={{color: this.props.headingColor}}
            className={block + '__heading'}>
          {this.props.heading}
        </h2>

        <SnapshotList snapshots={snapshots}
                      snapshotsWiredToHighlightedSnapshot={this.props.snapshotsWiredToHighlightedSnapshot}
                      highlightedSnapshot={this.props.highlightedSnapshot}/>
      </div>
    );
  },

  getAllSnapshotsWithThisSeverity() {
    return this.props.snapshotIssueSummary.keySeq()
      .map(this.getSnapshotWithId)
      .filter(snapshot => snapshot !== null);
  },

  getSnapshotWithId(snapshotId) {
    return this.props.snapshots.find(isIdEqual.bind(null, snapshotId), null, null);
  }
});

export default SeverityListing;
