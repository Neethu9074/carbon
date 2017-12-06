import React from 'react';

import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';
import { closeDashboardLink$ } from 'in-stores/navigation';
import Button from 'in-components/Button';

import './DashboardHeader.less';

const block = 'in-dashboard-header';

export default function DashboardHeader({ snapshotId }) {
  return (
    <header className={block}>
      <div>
        <Button href$={closeDashboardLink$} size="sm">
          close
        </Button>

        <span className={`${block}__title`}>Dashboard</span>
      </div>

      <DashboardBreadcrumb snapshotId={snapshotId} />
    </header>
  );
}
