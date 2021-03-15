/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Info from '../Info';

export default function OpcSidebarDetails({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
    </div>
  );
}
