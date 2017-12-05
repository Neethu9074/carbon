import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import { expandedSide$, toggleRight } from 'in-views/traceView/stores/expandedSide';
import TraceListHeader from 'in-views/traceView/components/TraceListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import { enable, disable } from 'in-views/traceView/stores/traceList';
import TraceTable from 'in-views/traceView/components/TraceTable';
import TraceTree from 'in-views/traceView/components/TraceTree';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { clearTraceSelection } from 'in-stores/traces';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

const leftContent = [<TraceListHeader key="0" />, <TraceTable key="2" />];

const rightContent = [
  <ViewHeader key="0">
    <ToggleViewHeader key="0" expandedSide$={expandedSide$} toggleRight={toggleRight} onClear={clearTraceSelection} />,
  </ViewHeader>,
  <TraceTree key="1" />
];

export default function TraceView() {
  return (
    <Sticky header={<SearchBar />}>
      <Title title="Traces" />
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

      <TwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="46rem"
        expandedSide$={expandedSide$}
      />

      {DashboardNavigationRoute}
    </Sticky>
  );
}
