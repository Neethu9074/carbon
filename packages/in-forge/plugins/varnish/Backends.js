/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Backends({ snapshot, backend }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Host">{data.get('backends.' + backend + '.host')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('backends.' + backend + '.port')}</DescriptionItem>
    </DescriptionList>
  );
}
