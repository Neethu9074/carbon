import React from 'react';

import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';
import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';

import './DashboardHeader.less';

const block = 'in-dashboard-header';

export default function DashboardHeader({ snapshotId }) {
  return (
    <header className={block}>
      <DashboardCloseButton />

      <span className={`${block}__title`}>
        Dashboard
      </span>

      <DashboardBreadcrumb snapshotId={snapshotId} />
    </header>
  );
}
