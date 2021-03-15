/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function IBMVSIInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Kind">{data.get('kind')}</DescriptionItem>
      <DescriptionItem title="Instance Name">{data.get('instance_name')}</DescriptionItem>
      <DescriptionItem title="Generation ID">{data.get('generation_id')}</DescriptionItem>
      <DescriptionItem title="CPU count">{data.get('count')}</DescriptionItem>
    </DescriptionList>
  );
}
