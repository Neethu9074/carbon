import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import { expandedSide$, toggleRight } from 'in-views/traceView/stores/expandedSide';
import TraceListHeader from 'in-views/traceView/components/TraceListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import { enable, disable } from 'in-views/traceView/stores/traceList';
import TraceTable from 'in-views/traceView/components/TraceTable';
import TraceTree from 'in-views/traceView/components/TraceTree';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { clearTraceSelection } from 'in-stores/traces';
import LegacyView from 'in-components/LegacyView';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

import './TraceView.less';

const block = 'in-trace-view';

const leftContent = <TraceTable />;
const rightContent = <TraceTree />;

export default function TraceView() {
  return (
    <Sticky header={<SearchBar />}>
      <LegacyView />
      <Title title="Traces" />
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

      <Sticky
        header={
          <ViewHeader
            expandedSide$={expandedSide$}
            toggleRight={toggleRight}
            leftContent={<TraceListHeader />}
            leftWidth="46rem"
            onClear={clearTraceSelection}
          />
        }
      >
        <div className={block}>
          <TwoColumnView
            leftContent={leftContent}
            rightContent={rightContent}
            leftWidth="46rem"
            expandedSide$={expandedSide$}
          />
        </div>
      </Sticky>

      {DashboardNavigationRoute}
    </Sticky>
  );
}
