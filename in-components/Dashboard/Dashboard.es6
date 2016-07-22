import React from 'react';

import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {selectedSnapshot$} from 'in-stores/snapshot';
import toPx from 'in-services/formatters/toPx';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './Dashboard.less';

const block = 'in-dashboard';

const DashboardContent = connectTo({
  snapshot: selectedSnapshot$,
  timeframe: timeframe$
}, function DashboardContent({snapshot}) {
  if (!snapshot) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <DashboardHeader snapshotId={snapshot.get('id')} />

      Dashboard!
    </div>
  );
});


export default connectTo({
  timelineHeight: timelineHeight$
}, function Dashboard({timelineHeight}) {
  return (
    <section className={block}
         style={{
           bottom: toPx(timelineHeight)
         }}>
      <DashboardContent />
    </section>
  );
});
