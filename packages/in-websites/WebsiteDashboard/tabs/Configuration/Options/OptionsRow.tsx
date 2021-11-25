/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import locals from './OptionsRow.mless';

export interface Props {
  children: ReactNode;
}

export default function Row({ children }: Props) {
  return <div className={locals.row}>{children}</div>;
}
