import { stopPropagationAndPreventDefault } from 'in-services/util/function';
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
    onClick(e) {
      if (!isPrimaryInteractiveElement(e.target)) {
        stopPropagationAndPreventDefault(e);
        onDefaultInteraction();
      }
    },
    onKeyDown(e) {
      if (isDefaultInteractionTrigger(e)) {
        stopPropagationAndPreventDefault(e);
      }
    },
    onKeyUp(e) {
      if (isDefaultInteractionTrigger(e)) {
        onDefaultInteraction();
      }
    }
  };
}

function isDefaultInteractionTrigger(e) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    return false;
  }

  if (isPrimaryInteractiveElement(e.target)) {
    return false;
  }

  // keyCode is deprecated and code is not yet supported everywhere
  const code = e.code != null ? e.code : e.keyCode;
  if (code !== keyCodes.return && code !== keyCodes.space) {
    return false;
  }

  return true;
}

function isPrimaryInteractiveElement(element) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLAnchorElement ||
    element instanceof HTMLButtonElement
  );
}
