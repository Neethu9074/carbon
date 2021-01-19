/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function GardenInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Container IP">{data.get('containerIP')}</DescriptionItem>
      <DescriptionItem title="Host IP">{data.get('hostIP')}</DescriptionItem>
      <DescriptionItem title="Container Path">{data.get('containerPath')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
      <DescriptionItem title="Org Id">{data.get('orgId')}</DescriptionItem>
      <DescriptionItem title="Space Id">{data.get('spaceId')}</DescriptionItem>
      <DescriptionItem title="App Id">{data.get('appId')}</DescriptionItem>
      <DescriptionItem title="Instance Index">{data.get('cfInstanceIndex')}</DescriptionItem>
    </DescriptionList>
  );
}
