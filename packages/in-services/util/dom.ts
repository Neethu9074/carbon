/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isInStickyBody, withDisabledStickyBodyTopPadding } from 'in-components/Sticky/scrolling';

const supportsTransformWithOutPrefix = 'transform' in document.body.style;

export function applyTransform(ele: HTMLElement, transform: string) {
  if (!supportsTransformWithOutPrefix) {
    // required for Safari (2015-08-24)
    ele.style.webkitTransform = transform;
  } else {
    ele.style.transform = transform;
  }
}

export function scrollIntoView(element: HTMLElement, options: ScrollIntoViewOptions = {}) {
  if (!element) {
    return;
  }

  if (!isInStickyBody(element)) {
    element.scrollIntoView(options);
    return;
  }

  // We cannot scroll to top (start) alone, as it will place the element behind our sticky header
  // to move our regular content below the header, we applied a top padding to the wrapper of the sticky.
  // By setting that padding to 0 and after scrolling baack to the original value, we effectively scroll
  // to 'start' + paddingTop
  let notAtTopAfterScrolling = false;
  withDisabledStickyBodyTopPadding(() => {
    element.scrollIntoView({ behavior: options.behavior || 'auto', block: options.block || 'start' });
    notAtTopAfterScrolling = element.getBoundingClientRect().top > 0;
  });

  // If we are not at the top after scrolling, the element was too low on the page to be scrolled up
  // that means that after applying the padding again, that element will scroll down again and potentially
  // partially out of view. Therefor we must scroll it again afterwards
  if (notAtTopAfterScrolling) {
    element.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

export function scrollToTopSmoothly() {
  const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(scrollToTopSmoothly);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

export function scrollToTop(domElement: HTMLElement) {
  if (domElement.scrollTo) {
    domElement.scrollTo(0, 0);
  }
}

// Calculate the position of an element relative to the document root.
export function getCoords(elem: HTMLElement) {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

export function findParentNodeByClassName(node: Element | null, className: string) {
  while (node != null) {
    if (node.classList.contains(className)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

// lazy load this calculation because getComputedStyle is unknown under node environment (which is used for tests)
let defaultFontSize: number | null = null;
function getDefaultFontSize() {
  if (!defaultFontSize) {
    defaultFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }

  return defaultFontSize;
}

export function getFactor() {
  return 16 / getDefaultFontSize();
}

export function convertRemToPx(rem: number) {
  return rem * getDefaultFontSize();
}

export function getInteractiveElements(parent: HTMLElement) {
  return Array.prototype.slice
    .call(parent.querySelectorAll('a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'))
    .filter(element => !element.hasAttribute('disabled') && element.clientWidth > 0);
}
