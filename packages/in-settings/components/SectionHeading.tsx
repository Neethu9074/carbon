/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './typography.mless';

export interface Props {
  withoutTopSpacing?: boolean;
  children: React.ReactNode;
}

export default function SectionHeading({ children, withoutTopSpacing }: Props) {
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
