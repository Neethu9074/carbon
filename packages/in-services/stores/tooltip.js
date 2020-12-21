import { create } from '@instana/observables';
import rpt from 'prop-types';

const reemitSpec = { emitLatestOnSubscribe: true };

export const TooltipShape = rpt.shape({
  content: rpt.node,
  focusedElement: rpt.oneOfType([rpt.instanceOf(window.HTMLElement), rpt.instanceOf(window.SVGSVGElement)]),
  themeStyle: rpt.string,
  bindToMousePosition: rpt.bool,
  focusedPoint: rpt.shape({
    x: rpt.number,
    y: rpt.number
  }),
  align: rpt.oneOf([
    'leftBottom',
    'leftMiddle',
    'leftTop',
    'topLeft',
    'topMiddle',
    'topRight',
    'rightTop',
    'rightMiddle',
    'rightBottom',
    'bottomLeft',
    'bottomMiddle',
    'bottomRight',
    'auto',
    'mousePosition'
  ])
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
