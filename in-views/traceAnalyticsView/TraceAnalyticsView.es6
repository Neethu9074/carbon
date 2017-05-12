import React from 'react';

import { expandedSide$, toggleLeft, toggleRight } from 'in-views/traceAnalyticsView/stores/expandedSide';
import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import SelectedTraces from 'in-views/traceAnalyticsView/components/SelectedTraces';
import TwoColumnView from 'in-components/TwoColumnView';

const leftContent = [
  <ToggleViewHeader key="0" side="left" expandedSide$={expandedSide$} toggle={toggleLeft} />,
  <SelectedTraces key="1" />
];
const rightContent = [
  <ToggleViewHeader key="0" side="right" expandedSide$={expandedSide$} toggle={toggleRight} />,
  <span key="1">Trace Analytics!!!1111</span>
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
