/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './Section.mless';

interface Props {
  restrictWidth?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ restrictWidth, children, className }: Props) {
  return (
    <div
      style={{
        maxWidth: restrictWidth
      }}
      className={classNames(locals.section, className)}
    >
      {children}
    </div>
  );
}
