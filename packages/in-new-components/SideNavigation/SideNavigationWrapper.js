/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './SideNavigationWrapper.mless';

export default function SideNavigationWrapper({ sidebar, children }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.sidebar}>{sidebar}</div>

      <div className={locals.content}>{children}</div>
    </div>
  );
}
