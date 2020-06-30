import { isPrimaryInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import keyCodes from 'in-components/keyCodes';

export function onKeyDown(e, stopElement) {
  if (e.keyCode !== keyCodes.arrows.left && e.keyCode !== keyCodes.arrows.right) {
    return;
  }

  // Do execute custom focus change logic when typing in regular input fields
  if (isPrimaryInteractiveElement(e.target)) {
    return;
  }

  stopPropagationAndPreventDefault(e);
  if (e.keyCode === keyCodes.arrows.left) {
    return focusPrevious({ element: e.target, stopElement, allowSelfFocussing: false, traverseChildren: false });
  }
  focusNext({
    element: e.target,
    stopElement,
    allowSelfFocussing: false
  });
}

function focusPrevious({ element, stopElement, allowSelfFocussing = true, traverseChildren = true }) {
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

function focusNext({ element, stopElement, allowSelfFocussing = true, traverseChildren = true }) {
  if (!element) {
    return false;
  }

  if (allowSelfFocussing && isFocusable(element)) {
    element.focus();
    return true;
  }

  if (traverseChildren && element.childNodes?.length > 0) {
    const firstChild = element.childNodes[0];
    if (focusNext({ element: firstChild, stopElement: element })) {
      return true;
    }
  }

  const { nextSibling } = element;
  if (nextSibling && focusNext({ element: nextSibling, stopElement })) {
    return true;
  }

  const parent = element.parentNode;
  if (
    parent &&
    parent !== stopElement &&
    focusNext({ element: parent, stopElement, traverseChildren: false, allowSelfFocussing: false })
  ) {
    return true;
  }

  return false;
}

function isFocusable(element) {
  return (
    element.tabIndex >= 0 &&
    // Avoid focussing the query builder elements' sub-elements, e.g. the input fields
    // within the Tag component.
    element.dataset.queryBuilderElement === 'true'
  );
}

export function onElementKeyUp({ event, onRemove, renderModelIndex, formModelIndex }) {
  if (!onRemove) {
    return;
  }

  if (event.keyCode === keyCodes.backspace || event.keyCode === keyCodes.delete) {
    stopPropagationAndPreventDefault(event);
    onRemove(formModelIndex, renderModelIndex - 1);
  }
}
