import React from 'react';

import LifecycleObserver from 'in-components/LifecycleObserver';

// Necessary to avoid elastic scrolling effects on MacOS. For fullscreen views / canvas views which have a custom
// scroll behavior, this would otherwise result in confusing behavior.
// https://www.pivotaltracker.com/story/show/153704585
export default function DisabledBodyScroll() {
  return <LifecycleObserver onWillMount={disableBodyScroll} onWillUnmount={enableBodyScroll} />;
}

export function disableBodyScroll() {
  document.documentElement.style.overflow = 'hidden';
}

export function enableBodyScroll() {
  document.documentElement.style.overflow = null;
}
