/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import type { ReactNode } from 'react';
import React from 'react';

import locals from './SloTableHeader.mless';

interface SloTableHeaderProps {
  children: ReactNode;
}

export default function SloTableHeader({ children }: SloTableHeaderProps) {
  return <div className={locals.header}>{children}</div>;
}
