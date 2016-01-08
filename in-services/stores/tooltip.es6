import * as ro from 'reactive-observables';
import React from 'react';

const rpt = React.PropTypes;
const reemitSpec = {emitLatestOnSubscribe: true};

export const TooltipShape = rpt.shape({
  content: rpt.oneOfType([
    rpt.element.isRequired,
    rpt.string.isRequired
  ]),
  focusedElement: rpt.instanceOf(window.HTMLElement),
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
