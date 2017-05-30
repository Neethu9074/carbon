import React from 'react';

import { addMarkedTracesToAnalytics, markTraces, markedTraces$ } from 'in-stores/traces/analytics/markedTraces';
import { maximumNumberOfTracesForAnalytics, traceAnalyticsEnabled } from 'in-services/featureFlags';
import { toggleAutoUpdate, autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import { totalTraceCountActiveFilter$, clearTraceSelection } from 'in-stores/traces';
import { expandedSide$, toggleLeft } from 'in-views/traceView/stores/expandedSide';
import { analysedTraces$ } from 'in-stores/traces/analytics/analysedTraces';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { refresh, traces$ } from 'in-views/traceView/stores/traceList';
import Count from 'in-views/traceViewTabs/components/Count';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default connectTo(
  {
    analysedTraces: analysedTraces$,
    markedTraces: markedTraces$,
    expandedSide: expandedSide$,
    traces: traces$
  },
  function TraceListHeader({ analysedTraces, expandedSide, markedTraces, traces }) {
    const remainingCount = Math.min(
      traces.length,
      // if the limit is 100, there are 99 already analysed and 1 marked (total = 100), allow to add the marked one, but not more (so -1)
      maximumNumberOfTracesForAnalytics - (analysedTraces.size + markedTraces.size - 1)
    );

    return (
      <ViewHeader className={block}>
        {traceAnalyticsEnabled
          ? <div className={`${block}__left-side`}>
              {traces.length > 0
                ? <Button kind="info" size="sm" onClick={() => markTraces(traces.map(t => t.raw))}>
                    Mark all traces
                  </Button>
                : null}
              {markedTraces.size > 0
                ? <Button
                    kind="info"
                    size="sm"
                    onClick={() => {
                      addMarkedTracesToAnalytics();
                      clearTraceSelection();
                    }}
                    disabled={remainingCount <= 0}
                    className={`${block}__add-marked-traces`}
                  >
                    {remainingCount <= 0
                      ? `Max #traces for trace analytics reached`
                      : `Add marked traces (${markedTraces.size})`}
                  </Button>
                : null}
            </div>
          : <div className={`${block}__left-side`}>
              <strong className={`${block}__count`}>Traces <Count count$={totalTraceCountActiveFilter$} /></strong>
            </div>}

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
