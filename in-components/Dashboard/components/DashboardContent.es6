import React from 'react';

import DashboardJumpLabels from 'in-components/Dashboard/components/DashboardJumpLabels';
import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {selectedSnapshot$} from 'in-stores/snapshot';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Jail from 'in-components/Jail';

import './DashboardContent.less';

const block = 'in-dashboard-content';

export default connectTo({
  snapshot: selectedSnapshot$,
  timeframe: timeframe$
}, function DashboardContent({snapshot, timeframe}) {
  if (!snapshot) {
    return <LoadingIndicator type='dark' />;
  }

  const snapshotId = snapshot.get('id');
  const plugin = snapshot.get('plugin');
  const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Content.es6`);
  const SidebarImpl = getForgeComponent(`./${plugin}/Dashboard/Sidebar.es6`);

  return (
    <div className={block}>
      <DashboardHeader snapshotId={snapshotId} />
      <DashboardJumpLabels snapshotId={snapshotId} />

      <div className={`${block}__wrapper`}>
        <div className={`${block}__sidebar`}>
          <SidebarContent snapshot={snapshot}
                          ForgeDetailsComponent={SidebarImpl} />
        </div>
        <div className={`${block}__content`}>
          <Jail component={DashboardImpl}
                props={{snapshot, timeframe}}/>
        </div>
      </div>
    </div>
  );
});
