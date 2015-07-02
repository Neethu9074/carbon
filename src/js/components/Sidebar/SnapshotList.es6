'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';

import {getIdString} from 'instana-ui-services/util/snapshots';

import Snapshot from './Snapshot';

import './SnapshotList.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-snapshot-list';

const SidebarSnapshotList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: rpt.oneOfType([
      irpt.seq,
      rpt.array
    ]).isRequired,
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map.isRequired
  },

  render() {
    return (
      <ul className={block}>
        {this.toJs(this.props.snapshots.map(snapshot =>
          <Snapshot snapshot={snapshot}
                    key={getIdString(snapshot)}
                    highlighted={this.props.highlightedSnapshot === snapshot}
                    wired={this.isWired(snapshot)}/>
        ))}
      </ul>
    );
  },

  isWired(snapshot) {
    const snapshotsWiredToHighlightedSnapshot = this.props.snapshotsWiredToHighlightedSnapshot;
    return snapshotsWiredToHighlightedSnapshot.get('incoming').contains(snapshot) ||
      snapshotsWiredToHighlightedSnapshot.get('outgoing').contains(snapshot);
  },

  toJs(list) {
    if (Immutable.List.isList(list)) {
      return list.toArray();
    }

    return list;
  }
});

export default SidebarSnapshotList;
