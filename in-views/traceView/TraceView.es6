import React from 'react';

import TraceDetailHeader from 'in-views/traceView/components/TraceDetailHeader';
import TraceTableHeader from 'in-views/traceView/components/TraceTableHeader';
import TraceListHeader from 'in-views/traceView/components/TraceListHeader';
import { expandedSide$ } from 'in-views/traceView/stores/expandedSide';
import { enable, disable } from 'in-views/traceView/stores/traceList';
import TraceTable from 'in-views/traceView/components/TraceTable';
import TraceTree from 'in-views/traceView/components/TraceTree';
import LifecycleObserver from 'in-components/LifecycleObserver';
import TwoColumnView from 'in-components/TwoColumnView';

import './TraceView.less';

const block = 'in-trace-view';

export default function TraceView({ children }) {
  return (
    <div className={block}>
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />
      <TwoColumnView
        leftContent={getLeftContent()}
        rightContent={getRightContent()}
        leftWidth="47rem"
        expandedSide$={expandedSide$}
      />
      {children}
    </div>
  );
}

function getLeftContent() {
  return [
    <TraceListHeader key="TraceListHeader" />,
    <TraceTableHeader key="TraceTableHeader" />,
    <TraceTable key="TraceTable" />
  ];
}

function getRightContent() {
  return [<TraceDetailHeader key="ViewHeader" />, <TraceTree key="TraceTree" />];
}
