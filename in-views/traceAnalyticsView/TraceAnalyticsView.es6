import React from 'react';

import { expandedSide$, toggleLeft, toggleRight } from 'in-views/traceAnalyticsView/stores/expandedSide';
import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import SelectedTraces from 'in-views/traceAnalyticsView/components/SelectedTraces';
import TraceGroupings from 'in-views/traceAnalyticsView/components/TraceGroupings';
import { removeAllTraces } from 'in-stores/traces/analytics';
import TwoColumnView from 'in-components/TwoColumnView';
import Button from 'in-components/Button';

const removeAllTracesButton = (
  <Button kind="danger" size="sm" onClick={removeAllTraces}>
    Remove all from analytics
  </Button>
);

const leftContent = [
  <ToggleViewHeader
    key="0"
    side="left"
    expandedSide$={expandedSide$}
    toggle={toggleLeft}
    leftChildren={removeAllTracesButton}
  />,
  <SelectedTraces key="1" />
];
const rightContent = [
  <ToggleViewHeader key="0" side="right" expandedSide$={expandedSide$} toggle={toggleRight} />,
  <TraceGroupings key="1" />
];

export default function TraceAnalyticsView() {
  return (
    <TwoColumnView
      leftContent={leftContent}
      rightContent={rightContent}
      leftWidth="30rem"
      expandedSide$={expandedSide$}
    />
  );
}
