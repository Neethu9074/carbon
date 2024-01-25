/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/azureStorage/Info';

export default function AzureStorageSidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <TagList snapshot={snapshot} />
    </div>
  );
}
