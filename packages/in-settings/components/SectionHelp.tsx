/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './typography.mless';

interface Props {
  children: React.ReactNode;
}

export default function SectionHelp({ children }: Props) {
  return <div className={locals.sectionHelp}>{children}</div>;
}
