/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('full_version')}</DescriptionItem>
      <DescriptionItem title="Revision">{data.get('revision')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('server_state')}</DescriptionItem>
      <DescriptionItem title="Master Server">{yesOrNo(data.get('is_master_server'))}</DescriptionItem>
      <DescriptionItem title="Unsynchronized">{yesOrNo(data.get('is_out_of_sync'))}</DescriptionItem>
    </DescriptionList>
  );
}
