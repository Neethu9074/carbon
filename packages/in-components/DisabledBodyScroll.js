import React from 'react';

import LifecycleObserver from 'in-components/LifecycleObserver';

// Necessary to avoid elastic scrolling effects on MacOS. For fullscreen views / canvas views which have a custom
// scroll behavior, this would otherwise result in confusing behavior.
// https://www.pivotaltracker.com/story/show/153704585
export default function DisabledBodyScroll() {
  return <LifecycleObserver onDidMount={disableBodyScroll} onWillUnmount={enableBodyScroll} />;
}

export function disableBodyScroll() {
  // Implement disabled body scrolling without a jumping document body
  // as caused by a suddenly vanishing scroll bar.
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'visible';
}

export function enableBodyScroll() {
  document.documentElement.style.overflow = null;
  document.body.style.overflow = null;
}
