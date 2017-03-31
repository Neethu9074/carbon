import React from 'react';

import SidebarHeader from 'in-components/MapSidebar/components/SidebarHeader';
import Jail from 'in-components/Jail';

import './SidebarContent.less';

const block = 'in-sidebar-content';

export default function SidebarContent({ snapshot, ForgeDetailsComponent }) {
  return (
    <div className={block}>
      <SidebarHeader snapshot={snapshot} />

      <Jail component={ForgeDetailsComponent} props={{ snapshot }} />
    </div>
  );
}
