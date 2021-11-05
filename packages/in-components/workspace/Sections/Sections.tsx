/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { Ul } from '@instana/components';

interface SectionsProps {
  className?: string;
  children: ReactNode;
}

export default function Sections({ className, children }: SectionsProps) {
  return (
    <Ul className={className} component="div">
      {children}
    </Ul>
  );
}
