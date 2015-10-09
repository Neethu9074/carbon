import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import classnames from 'in-services/util/classnames';
import * as tracking from 'in-services/tracking';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';

import './Snapshot.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-snapshot';

const SidebarSnapshot = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    highlighted: rpt.bool.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    return (
      <li className={classnames({
            [block]: true,
            [block + '--highlighted']: this.props.highlighted
          })}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}>

        {getLabel(snapshot)}
        <HealthIcon snapshot={snapshot}
                    className={block + '-health'}/>
      </li>
    );
  },

  onClick() {
    tracking.trackEvent(tracking.events.clickOnServerInSidebar);
    selectedSnapshotStore.select(this.props.snapshot);
  },

  onMouseEnter() {
    highlightedSnapshotStore.select(this.props.snapshot);
  },

  onMouseLeave() {
    highlightedSnapshotStore.clear();
  }
});

export default SidebarSnapshot;
