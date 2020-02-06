import React from 'react';

import TooltipContent from 'in-components/Chart/components/TooltipContent';

import locals from './TooltipLineAndContent.mless';

export default function TooltipLineAndContent({
  cursorXPosition,
  align,
  timestamp,
  hoveredEvent,
  chart,
  reverseTooltipOrder,
  metrics,
  customEventSection
}) {
  const { excludedLabelsFromTooltip } = metrics.y1;
  return (
    <div
      className={locals.line}
      style={{
        left: cursorXPosition
      }}
    >
      <div className={[locals[align]]}>
        <TooltipContent
          customEventSection={customEventSection}
          hoveredEvent={hoveredEvent}
          timestamp={timestamp}
          chart={chart}
          reverseTooltipOrder={reverseTooltipOrder}
          excludedLabelsFromTooltip={excludedLabelsFromTooltip}
        />
      </div>
    </div>
  );
}
