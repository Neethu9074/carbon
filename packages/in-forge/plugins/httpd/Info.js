/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function HttpdInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Architecture">{data.get('architecture')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Max workers">{data.get('max_workers')}</DescriptionItem>
      <DescriptionItem title="MPM">{data.get('mpm')}</DescriptionItem>
      <DescriptionItem title="Listen">{data.get('ports', []).join(', ')}</DescriptionItem>
    </DescriptionList>
  );
}
