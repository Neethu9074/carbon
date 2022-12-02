/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren } from 'react';

import locals from './TabSelect.mless';

export interface TabSelectHeaderProps {}

export function TabSelectHeader({ children }: PropsWithChildren<TabSelectHeaderProps>) {
  return <div className={locals.header}>{children}</div>;
}
