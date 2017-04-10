import React from 'react';

import { totalTraceCountWithoutEum$, totalTraceCountOnlyEum$, totalTraceCountActiveFilter$ } from 'in-stores/traces';
import TraceListFilterToggle from 'in-views/traceView/components/TraceListFilterToggle';
import { toggleAutoUpdate, autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import { setTypeFilter, removeTypeFilter } from 'in-views/traceView/stores/filters';
import { expandedSide$, toggleLeft } from 'in-views/traceView/stores/expandedSide';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { refresh } from 'in-views/traceView/stores/traceList';
import Count from 'in-views/traceView/components/Count';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default connectTo(
  {
    expandedSide: expandedSide$
  },
  function TraceListHeader({ expandedSide }) {
    return (
      <ViewHeader className={block}>
        <div className={`${block}__left-side`}>
          <h1 className={`${block}__title`}>
            Traces
            <Count count$={totalTraceCountActiveFilter$} formatCount={formatCount} />
          </h1>

          <TraceListFilterToggle filter="all" onClick={removeTypeFilter}>
            All Calls
          </TraceListFilterToggle>

          <TraceListFilterToggle filter="without-eum" onClick={() => setTypeFilter('server')}>
            Server Calls
            <Count count$={totalTraceCountWithoutEum$} formatCount={formatCount} />
          </TraceListFilterToggle>

          <TraceListFilterToggle filter="eum" onClick={() => setTypeFilter('eum')}>
            EUM Calls
            <Count count$={totalTraceCountOnlyEum$} formatCount={formatCount} />
          </TraceListFilterToggle>
        </div>

        <div className={`${block}__right-side`}>
          <SvgIcon type="refresh" onClick={refresh} height={15} className={`${block}__refresh`} />
          <AutoUpdate
            checkboxId="trace-view-auto-update"
            autoUpdate$={autoUpdate$}
            toggleAutoUpdate={toggleAutoUpdate}
          />
          <SvgIcon
            type={expandedSide === 'left' ? 'minimize' : 'maximize'}
            onClick={toggleLeft}
            height={14}
            className={`${block}__toggle-left`}
          />
        </div>
      </ViewHeader>
    );
  }
);

function formatCount(count) {
  return (
    <span>
      &nbsp;({zeroDecimalPlaces(count)})
    </span>
  );
}
