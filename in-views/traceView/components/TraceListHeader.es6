import React from 'react';

import {setTraceTypeFilter, removeTraceTypeFilter} from 'in-views/traceView/stores/filters';
import TraceListFilterToggle from 'in-views/traceView/components/TraceListFilterToggle';
import {toggleAutoUpdate, autoUpdate$} from 'in-views/traceView/stores/autoUpdate';
import {totalTraceCountWithoutEum$, totalTraceCountOnlyEum$, totalTraceCountNoFiltering$} from 'in-stores/traces';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {refresh} from 'in-views/traceView/stores/traceList';
import Count from 'in-views/traceView/components/Count';
import {isEumEnabled} from 'in-services/featureFlags';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default function TraceListHeader() {
  return (
    <ViewHeader className={block}>
      <div className={`${block}__left-side`}>
        <h1 className={`${block}__title`}>
          Traces

          {!isEumEnabled ?
            <Count count$={totalTraceCountNoFiltering$} />
          : null}
        </h1>

        {isEumEnabled ?
          <TraceListFilterToggle filter='all'
                                 onClick={removeTraceTypeFilter}>
            All Calls
          </TraceListFilterToggle>
        : null}

        {isEumEnabled ?
          <TraceListFilterToggle filter='without-eum'
                                 onClick={() => setTraceTypeFilter('eum', '!=')}>
            Server Calls
            <Count count$={totalTraceCountWithoutEum$} />
          </TraceListFilterToggle>
        : null}

        {isEumEnabled ?
          <TraceListFilterToggle filter='eum'
                                 onClick={() => setTraceTypeFilter('eum')}>
            EUM Calls
            <Count count$={totalTraceCountOnlyEum$} />
          </TraceListFilterToggle>
        : null}
      </div>

      <div className={`${block}__right-side`}>
        <SvgIcon type='refresh'
                 onClick={refresh}
                 height={15}
                 className={`${block}__refresh`} />
        <AutoUpdate checkboxId='trace-view-auto-update'
                    autoUpdate$={autoUpdate$}
                    toggleAutoUpdate={toggleAutoUpdate} />
      </div>
    </ViewHeader>
  );
}
