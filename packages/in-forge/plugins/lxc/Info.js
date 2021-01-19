/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function LxcInfo({ snapshot }) {
  const data = snapshot.get('data');
  const privileged = '(' + (data.get('privileged') ? 'privileged' : 'unprivileged') + ')';

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('state') + ' ' + privileged}</DescriptionItem>
      <DescriptionItem title="IP">{data.get('ip')}</DescriptionItem>
      <DescriptionItem title="Network Interface">{data.get('networkInterface')}</DescriptionItem>
    </DescriptionList>
  );
}
