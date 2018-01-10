import React from 'react';

import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';
import { getCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './DashboardHeader.less';

const block = 'in-dashboard-header';

export default connectTo(
  {
    closeDashboardLink: getCloseDashboardLink()
  },
  function DashboardHeader({ snapshotId, closeDashboardLink }) {
    return (
      <header className={block}>
        <div>
          <Button href={closeDashboardLink} size="sm">
            close
          </Button>

          <span className={`${block}__title`}>Dashboard</span>
        </div>

        <DashboardBreadcrumb snapshotId={snapshotId} />
      </header>
    );
  }
);
