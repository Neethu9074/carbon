import * as ro from 'reactive-observables';
import React from 'react';

const rpt = React.PropTypes;
const reemitSpec = {emitLatestOnSubscribe: true};

export const TooltipShape = rpt.shape({
  content: rpt.oneOfType([
    rpt.element,
    rpt.string
  ]),
  focusedElement: rpt.instanceOf(window.HTMLElement),
  focusedPoint: rpt.shape({
    x: rpt.number,
    y: rpt.number
  }),
  align: rpt.shape({
    horizontal: rpt.oneOf(['left', 'right', 'auto']),
    vertical: rpt.oneOf(['top', 'bottom', 'middle', 'auto'])
  })
});

export const activeTooltip = ro.create(reemitSpec);

export function setActiveTooltip(tooltip) {
  tooltip.align = tooltip.align || {};
  tooltip.align.horizontal = tooltip.align.horizontal || 'auto';
  tooltip.align.vertical = tooltip.align.vertical || 'auto';
  activeTooltip.emit(tooltip);
}

export function clearActiveTooltip() {
  activeTooltip.emit(null);
}
