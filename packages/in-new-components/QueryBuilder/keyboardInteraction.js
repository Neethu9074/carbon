import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import keyCodes from 'in-components/keyCodes';

// TODO testing
export function onKeyDown(e, stopElement) {
  if (e.keyCode !== keyCodes.arrows.left && e.keyCode !== keyCodes.arrows.right) {
    return;
  }

  stopPropagationAndPreventDefault(e);
  if (e.keyCode === keyCodes.arrows.left) {
    return focusPrevious({ element: e.target, stopElement, allowSelfFocussing: false, traverseChildren: false });
  }
  focusNext({
    element: e.target,
    stopElement,
    allowSelfFocussing: false,
    parentFocussable: false
  });
}

// TODO testing
// Exported to allow testing
export function focusPrevious({ element, stopElement, allowSelfFocussing = true, traverseChildren = true }) {
  if (!element) {
    return false;
  }

  if (traverseChildren && element.childNodes?.length > 0) {
    const lastChild = element.childNodes[element.childNodes.length - 1];
    if (focusPrevious({ element: lastChild, stopElement: element })) {
      return true;
    }
  }

  if (allowSelfFocussing && isFocusable(element)) {
    element.focus();
    return true;
  }

  const sibling = element.previousSibling;
  if (sibling && focusPrevious({ element: sibling, stopElement })) {
    return true;
  }

  const parent = element.parentNode;
  if (parent && parent !== stopElement && focusPrevious({ element: parent, stopElement, traverseChildren: false })) {
    return true;
  }

  return false;
}

// TODO testing
// Exported to allow testing
export function focusNext({ element, stopElement, allowSelfFocussing = true }) {
  if (!element) {
    return false;
  }

  if (allowSelfFocussing && isFocusable(element)) {
    element.focus();
    return true;
  }

  const { nextSibling } = element;
  if (nextSibling && focusNext({ element: nextSibling, stopElement })) {
    return true;
  }

  return false;
}

function isFocusable(element) {
  return (
    element.tabIndex >= 0 &&
    // Avoid focussing the query builder elements sub-elements.
    element.dataset.renderModelIndex != null
  );
}

// TODO testing
export function onElementKeyUp({ event, onRemove, renderModelIndex, formModelIndex }) {
  if (!onRemove) {
    return;
  }

  if (event.keyCode === keyCodes.backspace || event.keyCode === keyCodes.delete) {
    stopPropagationAndPreventDefault(event);
    onRemove(formModelIndex, renderModelIndex - 1);
  }
}
