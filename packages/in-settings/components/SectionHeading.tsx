/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './typography.mless';

interface SectionHeadingProps {
  children: ReactNode;
  withoutTopSpacing?: boolean;
}

export default function SectionHeading({ children, withoutTopSpacing = false }: SectionHeadingProps) {
  return (
    <h3
      className={classNames({
        [locals.sectionHeading]: true,
        [locals.sectionHeadingWithoutTopPadding]: withoutTopSpacing
      })}
    >
      {children}
    </h3>
  );
}
