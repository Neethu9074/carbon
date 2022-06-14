/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React, { ReactNode } from 'react';

import locals from './typography.mless';

interface SectionHeadingProps {
  children: ReactNode;
  withoutTopSpacing?: boolean;
};

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
