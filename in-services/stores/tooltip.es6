import {create} from 'reactive-observables';
import React from 'react';


const rpt = React.PropTypes;
const reemitSpec = {emitLatestOnSubscribe: true};

export const TooltipShape = rpt.shape({
  content: rpt.oneOfType([
    rpt.element,
    rpt.string
  ]),
  focusedElement: rpt.oneOfType([
    rpt.instanceOf(window.HTMLElement),
    rpt.instanceOf(window.SVGSVGElement)
  ]),
  focusedPoint: rpt.shape({
    x: rpt.number,
    y: rpt.number
  }),
  align: rpt.oneOf(['leftBottom', 'leftMiddle', 'leftTop',
               'topLeft', 'topMiddle', 'topRight',
               'rightTop', 'rightMiddle', 'rightBottom',
               'bottomLeft', 'bottomMiddle', 'bottomRight', 'auto']
  )
});

export const activeTooltip = create(reemitSpec);

export function setActiveTooltip(tooltip) {
  if (!tooltip.content) {
    clearActiveTooltip();
  } else {
    tooltip.align = tooltip.align || 'auto';
    activeTooltip.emit(tooltip);
  }
}

export function clearActiveTooltip() {
  activeTooltip.emit(null);
}
