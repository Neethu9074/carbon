/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const nodes = snapshot.getIn(['data', 'nodes'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title="Replica Set Name">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="Nodes">{nodes.size}</DescriptionItem>
    </DescriptionList>
  );
}
