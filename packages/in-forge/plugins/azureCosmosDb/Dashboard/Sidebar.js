/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TagList from 'in-sdk/components/sidebar/TagList';

import Info from '../Info';

export default function AzureCosmosDbSidebarDetails({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <TagList snapshot={snapshot} />
    </div>
  );
}
