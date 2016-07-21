import React from 'react';

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
      Dashboard!
    </div>
  );
});


export default connectTo({
  timelineHeight: timelineHeight$
}, function Dashboard({timelineHeight}) {
  return (
    <div className={block}
         style={{
           bottom: toPx(timelineHeight)
         }}>
      <DashboardContent />
    </div>
  );
});
