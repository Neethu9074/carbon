/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul } from '@instana/components';

export default function Sections({ className, children }) {
  return (
    <Ul className={className} component="div">
      {children}
    </Ul>
  );
}
