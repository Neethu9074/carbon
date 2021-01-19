/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function CLRInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="CLR Version">{data.get('runtimeVersion')}</DescriptionItem>
      <DescriptionItem title="Arguments">{data.get('arguments')}</DescriptionItem>
    </DescriptionList>
  );
}
