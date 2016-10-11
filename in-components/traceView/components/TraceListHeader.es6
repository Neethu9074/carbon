import React from 'react';

import {totalTraceCountWithoutEum$, totalTraceCountOnlyEum$} from 'in-stores/traces';
import {setTraceTypeFilter, removeTraceTypeFilter} from 'in-components/traceView/stores/filters';
import TraceListFilterToggle from 'in-components/traceView/components/TraceListFilterToggle';
import Count from 'in-components/traceView/components/Count';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import AutoUpdate from 'in-components/traceView/components/AutoUpdate';
import {refresh} from 'in-components/traceView/stores/traceList';
import SvgIcon from 'in-components/SvgIcon';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default function TraceListHeader() {
  return (
    <ViewHeader className={block}>
      <div className={`${block}__left-side`}>
        <h1 className={`${block}__title`}>Traces</h1>

        <TraceListFilterToggle filter='all'
                               onClick={removeTraceTypeFilter}>
          All Calls
        </TraceListFilterToggle>

        <TraceListFilterToggle filter='without-eum'
                               onClick={() => setTraceTypeFilter('eum', '!=')}>
          Server Calls
          <Count count$={totalTraceCountWithoutEum$} />
        </TraceListFilterToggle>

        <TraceListFilterToggle filter='eum'
                               onClick={() => setTraceTypeFilter('eum')}>
          EUM Calls
          <Count count$={totalTraceCountOnlyEum$} />
        </TraceListFilterToggle>
      </div>

      <div className={`${block}__right-side`}>
        <SvgIcon type='refresh'
                 onClick={refresh}
                 height={15}
                 className={`${block}__refresh`}/>
        <AutoUpdate />
      </div>
    </ViewHeader>
  );
}
