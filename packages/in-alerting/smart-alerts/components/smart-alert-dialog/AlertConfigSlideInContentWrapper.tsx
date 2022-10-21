/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import locals from './AlertConfigSlideInContentWrapper.mless';

export default function AlertConfigSlideInContentWrapper({ children }: { children: ReactNode }) {
  return <div className={locals.slideInContentWrapper}>{children}</div>;
}
