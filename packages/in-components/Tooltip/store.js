/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';
import rpt from 'prop-types';

const reemitSpec = { emitLatestOnSubscribe: true };

export const TooltipShape = rpt.shape({
  content: rpt.node,
  focusedElement: rpt.instanceOf(window.Element),
  // The trigger for the tooltip. Used to identify the initial clientX/clientY coordinates when
  // align=mousePosition is used. This object helps us to avoid an initially wrongly positioned
  // tooltip element.
  mouseEvent: rpt.instanceOf(window.MouseEvent),
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
