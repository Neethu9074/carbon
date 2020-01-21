import React from 'react';

import TooltipContent from 'in-components/Chart/components/TooltipContent';

import locals from './TooltipLineAndContent.mless';

export default function TooltipLineAndContent({
  cursorXPosition,
  align,
  timestamp,
  hoveredEvent,
  isHighlightedTimeframeHovered,
  chart,
  reverseTooltipOrder,
  metrics
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
          hoveredEvent={hoveredEvent}
          timestamp={timestamp}
          isHighlightedTimeframeHovered={isHighlightedTimeframeHovered}
          chart={chart}
          reverseTooltipOrder={reverseTooltipOrder}
          excludedLabelsFromTooltip={excludedLabelsFromTooltip}
        />
      </div>
    </div>
  );
}
