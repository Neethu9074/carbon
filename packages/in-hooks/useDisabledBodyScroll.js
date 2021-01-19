/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSideEffectHook from 'in-hooks/createSideEffectHook';

// Disables body scrolling as long as the component is mounted.
export default createSideEffectHook(
  args => args.reduce((agg, _disabled) => agg || (_disabled ?? true), false),
  disabled => {
    if (disabled) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
  }
);

function disableBodyScroll() {
  // Implement disabled body scrolling without a jumping document body
  // as caused by a suddenly vanishing scroll bar.
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'visible';
}

function enableBodyScroll() {
  document.documentElement.style.overflow = null;
  document.body.style.overflow = null;
}
