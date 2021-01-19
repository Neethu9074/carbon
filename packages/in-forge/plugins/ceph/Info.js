/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Cluster Name">{data.get('cluster_name')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Fsid">{data.get('fsid')}</DescriptionItem>
    </DescriptionList>
  );
}
