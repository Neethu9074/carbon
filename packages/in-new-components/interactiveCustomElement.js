/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import keyCodes from 'in-components/keyCodes';

// This file implement the W3C WAI-ARIA best practices for interactable custom
// HTML elements, e.g. custom buttons, accordions etc.
// See https://www.w3.org/TR/wai-aria-practices/#aria_ex for details.
//
// React usage example:
//   <div {...toInteractiveElement({
//     ariaLabel: 'A fancy action happens when interacting with me!',
//     onDefaultInteraction: () =>  console.log('User interacted with me through mouse or keyboard!')
//   })}>
//     …
//   </div>

export function toInteractiveElement(args) {
  const { onDefaultInteraction, ariaLabel, role = 'button', tabIndex = 0 } = args;

  return {
    role,
    'aria-label': ariaLabel || args['aria-label'],
    tabIndex,
    ...withInteractivitySideEffects({
      onDefaultInteraction,
      preventDefault: true,
      stopPropagation: true
    })
  };
}

export function withInteractivitySideEffects({
  onDefaultInteraction,
  preventDefault = false,
  stopPropagation = false,
  allowSideEffectsOnPrimaryInteractiveElements = false
}) {
  return {
    onClick(e) {
      if (!isPrimaryInteractiveElement(e.target) || allowSideEffectsOnPrimaryInteractiveElements) {
        if (stopPropagation) {
          e.stopPropagation();
        }
        if (preventDefault) {
          e.preventDefault();
        }
        onDefaultInteraction();
      }
    },
    onKeyDown(e) {
      if (isDefaultInteractionTrigger(e, allowSideEffectsOnPrimaryInteractiveElements)) {
        onDefaultInteraction();
      }
    },
    onKeyUp(e) {
      if (isDefaultInteractionTrigger(e, allowSideEffectsOnPrimaryInteractiveElements)) {
        if (stopPropagation) {
          e.stopPropagation();
        }
        if (preventDefault) {
          e.preventDefault();
        }
      }
    }
  };
}

export function isDefaultInteractionTrigger(e, allowSideEffectsOnPrimaryInteractiveElements = false) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    return false;
  }

  if (isPrimaryInteractiveElement(e.target) && !allowSideEffectsOnPrimaryInteractiveElements) {
    return false;
  }

  // keyCode is deprecated and code is not yet supported everywhere
  const code = e.code != null ? e.code : e.keyCode;
  return code === keyCodes.return || code === keyCodes.space;
}

export function isPrimaryInteractiveElement(element) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLAnchorElement ||
    element instanceof HTMLButtonElement
  );
}
