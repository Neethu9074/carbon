import React from 'react';

import ViewDashboardButton from 'in-components/MapSidebar/components/ViewDashboardButton';
import FocusButton from 'in-components/MapSidebar/components/FocusButton';

import './MapSidebarHeader.less';

const block = 'in-map-sidebar-header';

export default function MapSidebarHeader({ snapshot }) {
  return (
    <div className={block}>
      <ViewDashboardButton snapshotId={snapshot.get('id')} />
      <FocusButton snapshot={snapshot} />
    </div>
  );
}
