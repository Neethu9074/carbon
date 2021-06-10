/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isPrimaryInteractiveElement } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import keyCodes from 'in-components/keyCodes';

export function onKeyDown(e, stopElement) {
  // Do execute custom focus change logic when typing in regular input fields
  if (isPrimaryInteractiveElement(e.target)) {
    return;
  }

  // keyCode is deprecated and code is not yet supported everywhere
  const code = e.code ?? e.keyCode;
  if ((e.metaKey && code === keyCodes.arrows.left) || code === keyCodes.home || (e.ctrlKey && code === keyCodes.a)) {
    stopPropagationAndPreventDefault(e);
    focusFirst(stopElement);
  } else if (
    (e.metaKey && code === keyCodes.arrows.right) ||
    code === keyCodes.end ||
    (e.ctrlKey && code === keyCodes.e)
  ) {
    stopPropagationAndPreventDefault(e);
    focusLast(stopElement);
  } else if (code === keyCodes.arrows.left) {
    stopPropagationAndPreventDefault(e);
    focusPrevious({ element: e.target, stopElement, allowSelfFocussing: false, traverseChildren: false });
  } else if (code === keyCodes.arrows.right) {
    stopPropagationAndPreventDefault(e);
    focusNext({
      element: e.target,
      stopElement,
      allowSelfFocussing: false
    });
  }
}

function focusFirst(stopElement) {
  const elements = stopElement.querySelectorAll('[data-query-builder-element]');
  elements[0]?.focus();
}

function focusLast(stopElement) {
  const elements = stopElement.querySelectorAll('[data-query-builder-element]');
  elements[elements.length - 1]?.focus();
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
  if (!onRemove || isPrimaryInteractiveElement(event.target)) {
    return;
  }

  if (event.keyCode === keyCodes.backspace || event.keyCode === keyCodes.delete) {
    stopPropagationAndPreventDefault(event);
    onRemove(formModelIndex, renderModelIndex - 1);
  }
}

export function onClickQueryBuilderContent(e, stopElement) {
  if (e.target !== stopElement) {
    return;
  }

  stopPropagationAndPreventDefault(e);

  const closestElement = getNearestDomElement(
    e,
    stopElement.querySelectorAll('[data-query-builder-element][data-render-model-index]')
  );

  closestElement?.focus();
}

export function getNearestDomElement(e, elements) {
  const clickedX = e.offsetX ?? e.nativeEvent?.offsetX;
  const clickedY = e.offsetY ?? e.nativeEvent?.offsetY;
  let closestElement;
  let closestXDistance;
  for (const element of elements) {
    const top = element.offsetTop;
    const bottom = element.offsetTop + element.offsetHeight;
    const x = element.offsetLeft + element.offsetWidth / 2;
    if (clickedY < top || clickedY > bottom) {
      // Click in a different row: Do not focus
      continue;
    }

    const xDistance = Math.abs(clickedX - x);
    if (closestElement == null || xDistance < closestXDistance) {
      closestElement = element;
      closestXDistance = xDistance;
    }
  }

  return closestElement;
}
