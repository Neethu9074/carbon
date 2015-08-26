import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';

import {getLabel} from 'in-sdk/snapshot';
import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';

import enhance from '../hoc/enhance';
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

    highlightedSnapshot: irpt.map
  },

  statics: {
    createObservables() {
      return {
        highlightedSnapshot: highlightedSnapshotStore.highlightedSnapshot
      };
    }
  },

  render() {
    const snapshots = this.props.snapshots.sort((s1, s2) => {
      const l1 = getLabel(s1);
      const l2 = getLabel(s2);
      return l1.localeCompare(l2);
    });

    return (
      <ul className={block}>
        {this.toJs(snapshots.map(snapshot =>
          <Snapshot snapshot={snapshot}
                    key={snapshot.get('id')}
                    highlighted={this.props.highlightedSnapshot === snapshot} />
        ))}
      </ul>
    );
  },

  toJs(list) {
    if (Immutable.List.isList(list)) {
      return list.toArray();
    }

    return list;
  }
});

export default enhance(SidebarSnapshotList);
