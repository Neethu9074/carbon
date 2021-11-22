/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './SectionLabelWithSubtext.mless';

interface SectionLabelWithSubtextProps {
  subtext: ReactNode;
  children: ReactNode;
}

export default function SectionLabelWithSubtext({ subtext, children }: SectionLabelWithSubtextProps) {
  return (
    <>
      {children}
      <span className={locals.subtext}>{subtext}</span>
    </>
  );
}
