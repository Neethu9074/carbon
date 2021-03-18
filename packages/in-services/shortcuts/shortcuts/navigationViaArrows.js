/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { leftArrowId, rightArrowId } from 'in-new-components/AnalyzeView/SplitScreenList/elementIds';
import { onScrollUp, onScrollDown } from 'in-components/Chart/components/TooltipContent';

export function onLeftArrow(e) {
  tryClick(e, leftArrowId);
}

export function onRightArrow(e) {
  tryClick(e, rightArrowId);
}

function tryClick(keyboardEvent, id) {
  const ele = document.getElementById(id);
  if (ele == null) {
    return;
  }

  const clickEvent = document.createEvent('Events');
  clickEvent.initEvent('click', true, false);
  ele.dispatchEvent(clickEvent);
  keyboardEvent.preventDefault();
  keyboardEvent.stopPropagation();
}

export function onUpArrow(e) {
  if (onScrollUp()) {
    e.preventDefault();
  }
}

export function onDownArrow(e) {
  if (onScrollDown()) {
    e.preventDefault();
  }
}
