/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const stickyWrapperClassName = 'sticky-wrapper';

export function withDisabledStickyBodyTopPadding(fn: () => void) {
  const elements = [...document.querySelectorAll(`.${stickyWrapperClassName}`)] as HTMLElement[];

  // unset padding top and remember correct value
  const originalPaddingTop = elements.map(e => {
    const paddingTop = e.style.paddingTop;
    e.style.paddingTop = '0px';
    return paddingTop;
  });

  // apply side effect
  fn();

  // restore
  elements.forEach((e, i) => (e.style.paddingTop = originalPaddingTop[i]));
}

export function isInStickyBody(e: HTMLElement | null): boolean {
  if (!e) {
    return false;
  } else if (e.classList && e.classList.contains(stickyWrapperClassName)) {
    return true;
  }

  if (e.parentElement && e.parentElement !== e) {
    return isInStickyBody(e.parentElement);
  }

  return false;
}
