/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Cluster Id">{data.get('clusterId')}</DescriptionItem>
      <DescriptionItem title="Group Name">{data.get('groupName')}</DescriptionItem>
      <DescriptionItem title="Is Cluster Safe">{yesOrNo(data.get('isClusterSafe'))}</DescriptionItem>
    </DescriptionList>
  );
}
