import React from 'react';

import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TraceListHeader from 'in-components/traceView/components/TraceListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {enable, disable} from 'in-components/traceView/stores/traceList';
import TraceTable from 'in-components/traceView/components/TraceTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import TraceTree from 'in-components/traceView/components/TraceTree';
import LifecycleObserver from 'in-components/LifecycleObserver';

export default function TraceView({children}) {
  return (
    <div>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable}/>
      <TwoColumnView leftContent={getLeftContent()}
                     rightContent={getRightContent()} />
      {children}
    </div>
  );
}

function getLeftContent() {
  return [
    <TraceListHeader key='TraceListHeader' />,
    <TraceTableHeader key='TraceTableHeader' />,
    <TraceTable key='TraceTable' />
  ];
}

function getRightContent() {
  return [
    <ViewHeader key='ViewHeader' />,
    <TraceTree key='TraceTree' />
  ];
}
