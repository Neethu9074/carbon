/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import locals from './FourLineWrapper.mless';

export default function FourLineWrapper({ children }: { children: ReactNode }) {
  return <div className={locals.fourLines}>{children}</div>;
}
