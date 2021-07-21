/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ReactNode } from 'react';
import rpt from 'prop-types';

import { light, dark } from '@instana/components';
import { create } from '@instana/observables';

type Align =
  | 'leftBottom'
  | 'leftMiddle'
  | 'leftTop'
  | 'topLeft'
  | 'topMiddle'
  | 'topRight'
  | 'rightTop'
  | 'rightMiddle'
  | 'rightBottom'
  | 'bottomLeft'
  | 'bottomMiddle'
  | 'bottomRight'
  | 'auto'
  | 'mousePosition';

export interface Tooltip {
  content: ReactNode;
  focusedElement: Element;
  mouseEvent: MouseEvent;
  themeStyle: typeof light | typeof dark;
  bindToMousePosition: boolean;
  focusedPoint: {
    x: number;
    y: number;
  };
  align: Align;
}

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

export const activeTooltip$ = create<Tooltip | undefined>();

export function setActiveTooltip(tooltip: Tooltip) {
  if (!tooltip.content) {
    clearActiveTooltip();
  } else {
    tooltip.align = tooltip.align || 'auto';
    activeTooltip$.emit(tooltip);
  }
}

export function clearActiveTooltip() {
  activeTooltip$.emit(undefined);
}
