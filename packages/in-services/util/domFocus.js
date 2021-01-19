/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { getInteractiveElements } from 'in-services/util/dom';
import { isSafari } from 'in-services/browser';
import keyCodes from 'in-components/keyCodes';

// Whether or not the browser respects/supports preventScroll: true
//
// Example:
// domElement.focus.({
//   preventScroll: true
// })
//
// Executing these focus calls at the wrong timing, e.g. during CSS transitions, can
// trip up CSS transitions. It is therefore important to avoid focus calls or to execute
// them after transitions have ended for browsers that do not support this flag.
export const supportsFocussingWithPreventedScrolling = !isSafari();

// Focuses the previous/next sibling when the arrow up/down arrow keys are pressed.
// Usage example:
// onKeyDown={onArrowKeyDownFocusSiblings}
export function onArrowKeyDownFocusSiblings(event) {
  const focusableElements = getInteractiveElements(event.currentTarget);
  const currentIndex = focusableElements.indexOf(event.target);

  if (currentIndex < 0) {
    // None of the focusable elements are focused - do not try to change the focus state.
    return;
  }

  // keyCode is deprecated and code is not yet supported everywhere
  const code = event.code ?? event.keyCode;
  let nextFocusIndex;
  if (code === keyCodes.arrows.up) {
    nextFocusIndex = currentIndex - 1;
  } else if (code === keyCodes.arrows.down) {
    nextFocusIndex = currentIndex + 1;
  }

  if (nextFocusIndex != null) {
    stopPropagationAndPreventDefault(event);
    nextFocusIndex = Math.max(0, Math.min(nextFocusIndex, focusableElements.length - 1));
    focusableElements[nextFocusIndex]?.focus();
    return focusableElements[nextFocusIndex];
  }
}
