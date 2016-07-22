import React from 'react';

import DashboardContent from 'in-components/Dashboard/components/DashboardContent';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './Dashboard.less';

const block = 'in-dashboard';


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
