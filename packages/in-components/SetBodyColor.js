/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LifecycleObserver from 'in-components/LifecycleObserver';

export default function SetBodyColor({ color }) {
  const originalbackgroundColor = document.documentElement.style.background;
  return (
    <LifecycleObserver
      onDidMount={() => (document.body.style.background = color)}
      onWillUnmount={() => (document.body.style.background = originalbackgroundColor)}
    />
  );
}
