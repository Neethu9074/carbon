/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function CouchbaseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Hostname">{data.get('node.hostname')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('node.version')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('node.status')}</DescriptionItem>
    </DescriptionList>
  );
}
