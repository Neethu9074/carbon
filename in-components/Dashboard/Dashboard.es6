import React from 'react';

import DashboardContent from 'in-components/Dashboard/components/DashboardContent';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {headerHeight$} from 'in-stores/header/height';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './Dashboard.less';

const block = 'in-dashboard';


export default connectTo({
  timelineHeight: timelineHeight$,
  headerHeight: headerHeight$
}, function Dashboard({timelineHeight, headerHeight}) {
  return (
    <section className={block}
         style={{
           top: toPx(headerHeight),
           bottom: toPx(timelineHeight)
         }}>
      <DashboardContent />
    </section>
  );
});
