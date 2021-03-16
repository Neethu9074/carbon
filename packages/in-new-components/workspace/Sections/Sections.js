/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul } from 'in-new-components/lists/List';

export default function Sections({ className, children }) {
  return (
    <Ul className={className} component="div">
      {children}
    </Ul>
  );
}
