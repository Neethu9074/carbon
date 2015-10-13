import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SidebarHeadingSnapshotMetadata from '../SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from '../SidebarHeadingNavigation';
import SidebarDetailList from '../SidebarDetailList';
import SidebarTabs from '../SidebarTabs';

import './SidebarDashboard.less';

const block = 'in-sidebar-dashboard';

const SidebarDashboard = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <SidebarTabs snapshot={snapshot}
                     className={block + '__tabs'}/>

        <SidebarHeadingNavigation snapshot={snapshot}>
         <SidebarHeadingNavigation.BackToMap snapshot={snapshot}/>
         <SidebarHeadingNavigation.BackToHostButton snapshot={snapshot}/>
        </SidebarHeadingNavigation>

        <SidebarHeadingSnapshotMetadata snapshot={snapshot}/>

        <SidebarDetailList snapshot={snapshot}
                           className={block + '__detail-list'}/>
      </div>
    );
  }
});

export default SidebarDashboard;
