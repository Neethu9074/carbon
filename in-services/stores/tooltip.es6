import React from 'react';
import * as ro from 'reactive-observables';

const rpt = React.PropTypes;
const reemitSpec = {emitLatestOnSubscribe: true};

export const TooltipShape = rpt.shape({
  content: rpt.string.isRequired,
  focusedElement: rpt.instanceOf(HTMLElement),
  focusedPoint: rpt.shape({
    x: rpt.number,
    y: rpt.number
  })
});

export const activeTooltip = ro.create(reemitSpec);

export function setActiveTooltip(tooltip) {
  activeTooltip.emit(tooltip);
}

export function clearActiveTooltip() {
  activeTooltip.emit(null);
}
