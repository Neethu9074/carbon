import React from 'react';

import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {selectedSnapshot$} from 'in-stores/snapshot';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './DashboardContent.less';

const block = 'in-dashboard-content';

export default connectTo({
  snapshot: selectedSnapshot$,
  timeframe: timeframe$
}, function DashboardContent({snapshot}) {
  if (!snapshot) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      <DashboardHeader snapshotId={snapshot.get('id')} />

      <div className={`${block}__wrapper`}>
        <div className={`${block}__sidebar`}>
          Sidebar
        </div>
        <div className={`${block}__content`}>
          Content!
        </div>
      </div>
    </div>
  );
});
