/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import locals from './WideRow.mless';

export interface Props {
  children: ReactNode;
}

export default function WideRow({ children }: Props) {
  return <div className={locals.row}>{children}</div>;
}
