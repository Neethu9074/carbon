/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './ScrollStep.mless';

export interface ScrollStepProps {
  id?: string;
  children: ReactNode;
}

export default function ScrollStep({ id, children }: ScrollStepProps) {
  return (
    <section id={id} className={locals.container}>
      {children}
    </section>
  );
}
