import { useLayoutEffect } from 'react';

// Disables body scrolling as long as the component is mounted.
export default function useDisabledBodyScroll(disabled = true) {
  useLayoutEffect(() => {
    if (disabled) {
      disableBodyScroll();
    }
    return enableBodyScroll;
  }, [disabled]);
}

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
