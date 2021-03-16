/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function IBMEtcdIInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Kind">{data.get('kind')}</DescriptionItem>
      <DescriptionItem title="Members">{data.get('member_ids').length}</DescriptionItem>
    </DescriptionList>
  );
}
