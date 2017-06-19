import React from 'react';

import { expandedSide$, toggleLeft, toggleRight } from 'in-views/traceAnalyticsView/stores/expandedSide';
import { analysedTraces$, removeTraceIds } from 'in-stores/traces/analytics/analysedTraces';
import { clear, markTraces, markedTraces$ } from 'in-stores/traces/analytics/markedTraces';
import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import SelectedTraces from 'in-views/traceAnalyticsView/components/SelectedTraces';
import TraceGroupings from 'in-views/traceAnalyticsView/components/TraceGroupings';
import TwoColumnView from 'in-components/TwoColumnView';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TraceAnalyticsView.less';

const block = 'in-trace-analytics-view';

const rightContent = [
  <ToggleViewHeader key="0" side="right" expandedSide$={expandedSide$} toggle={toggleRight} />,
  <TraceGroupings key="1" />
];

export default connectTo(
  {
    analysedTraces: analysedTraces$,
    markedTraces: markedTraces$
  },
  function TraceAnalyticsView({ markedTraces, analysedTraces }) {
    return (
      <TwoColumnView
        leftContent={[
          <ToggleViewHeader
            key="0"
            side="left"
            expandedSide$={expandedSide$}
            toggle={toggleLeft}
            leftChildren={
              <div>
                <Button
                  kind="info"
                  size="sm"
                  onClick={() => {
                    const tracesToMark = [];
                    analysedTraces.forEach(trace => tracesToMark.push(trace));
                    markTraces(tracesToMark);
                  }}
                >
                  Mark all traces
                </Button>
                {markedTraces.size > 0
                  ? <Button
                      kind="danger"
                      size="sm"
                      onClick={() => {
                        const tracesToRemove = [];
                        markedTraces.forEach((trace, id) => tracesToRemove.push(id));
                        removeTraceIds(tracesToRemove);

                        clear();
                      }}
                      className={`${block}__remove-marked-traces`}
                    >
                      {`Remove marked traces from analytics (${markedTraces.size})`}
                    </Button>
                  : null}
              </div>
            }
          />,
          <SelectedTraces key="1" />
        ]}
        rightContent={rightContent}
        leftWidth="30rem"
        expandedSide$={expandedSide$}
      />
    );
  }
);
