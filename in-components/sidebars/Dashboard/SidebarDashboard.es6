import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import SidebarHeadingSnapshotMetadata from 'in-components/sidebars/components/SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from 'in-components/sidebars/components/SidebarHeadingNavigation';
import SidebarDetailList from 'in-components/sidebars/components/SidebarDetailList';

import 'in-components/sidebars/Dashboard/SidebarDashboard.less';


const block = 'in-sidebar-dashboard';

const SidebarDashboard = React.createClass({
  mixins: [
    PureRenderMixin
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
        <SidebarHeadingNavigation snapshot={snapshot}>
         <SidebarHeadingNavigation.BackToMap snapshot={snapshot}/>
        </SidebarHeadingNavigation>

        <SidebarHeadingSnapshotMetadata snapshot={snapshot}/>

        <SidebarDetailList snapshot={snapshot}
                           className={block + '__detail-list'}
                           useDetailedInformation={true}/>
      </div>
    );
  }
});

export default SidebarDashboard;
