import irpt from 'react-immutable-proptypes';
import React from 'react';

import SidebarHeadingSnapshotMetadata from 'in-components/sidebars/components/SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from 'in-components/sidebars/components/SidebarHeadingNavigation';
import SidebarDetailList from 'in-components/sidebars/components/SidebarDetailList';
import BackToMapButton from 'in-components/sidebars/components/BackToMapButton';

import 'in-components/sidebars/Dashboard/SidebarDashboard.less';


const block = 'in-sidebar-dashboard';

export default function SidebarDashboard({snapshot}) {
  if (!snapshot) {
    return null;
  }

  return (
    <div className={block}>
      <SidebarHeadingNavigation snapshot={snapshot}>
        <BackToMapButton snapshot={snapshot}/>
      </SidebarHeadingNavigation>

      <SidebarHeadingSnapshotMetadata snapshot={snapshot}/>

      <SidebarDetailList snapshot={snapshot}
                         className={block + '__detail-list'}
                         useDetailedInformation={true}/>
    </div>
  );
}

SidebarDashboard.propTypes = {
  snapshot: irpt.map.isRequired
};
