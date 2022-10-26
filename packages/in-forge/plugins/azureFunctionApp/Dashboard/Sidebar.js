/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import TagList from 'in-sdk/components/sidebar/TagList';
import Info from '../Info';

export default function AzureFunctionAppSidebarDetails({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <TagList snapshot={snapshot} />
    </div>
  );
}
