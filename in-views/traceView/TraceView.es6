import React from 'react';

import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import { expandedSide$, toggleRight } from 'in-views/traceView/stores/expandedSide';
import TraceTableHeader from 'in-views/traceView/components/TraceTableHeader';
import TraceListHeader from 'in-views/traceView/components/TraceListHeader';
import { enable, disable } from 'in-views/traceView/stores/traceList';
import TraceTable from 'in-views/traceView/components/TraceTable';
import { traceAnalyticsEnabled } from 'in-services/featureFlags';
import TraceTree from 'in-views/traceView/components/TraceTree';
import LifecycleObserver from 'in-components/LifecycleObserver';
import TwoColumnView from 'in-components/TwoColumnView';

import './TraceView.less';

const block = 'in-trace-view';

const leftContent = [<TraceListHeader key="0" />, <TraceTableHeader key="1" />, <TraceTable key="2" />];

const rightContent = [
  <ToggleViewHeader key="0" side="right" expandedSide$={expandedSide$} toggle={toggleRight} />,
  <TraceTree key="1" />
];

export default function TraceView() {
  let style = undefined;
  if (!traceAnalyticsEnabled) {
    style = {
      maxHeight: '100%'
    };
  }
  return (
    <div className={block} style={style}>
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />
      <TwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="46rem"
        expandedSide$={expandedSide$}
      />
    </div>
  );
}
