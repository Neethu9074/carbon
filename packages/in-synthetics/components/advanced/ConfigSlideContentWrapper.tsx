/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import locals from './ConfigSlideContentWrapper.mless';

export default function ConfigSlideContentWrapper({ children }: { children: ReactNode }) {
  return <div className={locals.slideInContentWrapper}>{children}</div>;
}
