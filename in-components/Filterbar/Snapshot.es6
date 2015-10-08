import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import classnames from 'in-services/util/classnames';
import * as tracking from 'in-services/tracking';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';

import './Snapshot.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-snapshot';

const SidebarSnapshot = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    highlighted: rpt.bool.isRequired
  },


  render() {
    return (
      <li className={classnames({
            [block]: true,
            [block + '--highlighted']: this.props.highlighted
          })}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}>
        {getLabel(this.props.snapshot)}
        <HealthIcon snapshot={this.props.snapshot}
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
