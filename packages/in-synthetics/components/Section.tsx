/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import locals from './Section.mless';

export interface SectionProps {
  children: React.ReactNode | React.ReactNode[];
  headingText?: string;
}

export default function Section({ children, headingText }: SectionProps) {
  return (
    <section className={locals.container}>
      <h2 className={locals.heading}>{headingText}</h2>
      {children}
    </section>
  );
}

interface SubTitleProps {
  children: React.ReactNode | React.ReactNode[];
}

export function SubTitle({ children }: SubTitleProps) {
  return <h4 className={locals.subTitle}>{children}</h4>;
}
