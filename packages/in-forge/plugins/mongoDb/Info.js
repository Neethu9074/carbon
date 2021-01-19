/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function MongoDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Storage Engine">{data.get('storageEngine')}</DescriptionItem>
      <DescriptionItem title="Replica Set Name">{data.get('replicaSetName')}</DescriptionItem>
      <DescriptionItem title="Role">{data.get('role')}</DescriptionItem>
    </DescriptionList>
  );
}
