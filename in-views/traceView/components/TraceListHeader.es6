import React from 'react';

import { toggleAutoUpdate, autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import { selectedTracesCount$, addTracesUntilMax } from 'in-stores/traces/analytics';
import { expandedSide$, toggleLeft } from 'in-views/traceView/stores/expandedSide';
import { maximumNumberOfTracesForAnalytics } from 'in-services/featureFlags';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { refresh, traces$ } from 'in-views/traceView/stores/traceList';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default connectTo(
  {
    expandedSide: expandedSide$,
    selectedTracesCount: selectedTracesCount$,
    traces: traces$
  },
  function TraceListHeader({ expandedSide, selectedTracesCount, traces }) {
    const remainingCount = Math.min(traces.length, maximumNumberOfTracesForAnalytics - selectedTracesCount);

    return (
      <ViewHeader className={block}>
        <div className={`${block}__left-side`}>
          {traces.length > 0
            ? <Button
                kind="info"
                size="sm"
                onClick={() => addTracesUntilMax(traces.map(t => t.raw))}
                disabled={remainingCount <= 0}
              >
                {remainingCount <= 0 ? `Max #traces for trace analytics reached` : `Select all traces for analytics`}
              </Button>
            : null}
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
