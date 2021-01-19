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
      <DescriptionItem title="Cluster">{data.get('clusterId')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Host IP">{data.get('hostIp')}</DescriptionItem>
      <DescriptionItem title="Pod IP">{data.get('podIp')}</DescriptionItem>
      <DescriptionItem title="Phase">{data.get('phase')}</DescriptionItem>
    </DescriptionList>
  );
}
