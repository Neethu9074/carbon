/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function F5Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Signature">{data.get('signature')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Total Memory">{snapshot.get('memTotal')}</DescriptionItem>
      <DescriptionItem title="Free Memory">{data.get('memFree')}</DescriptionItem>
      <DescriptionItem title="CPU Usage">{data.get('cpuUsed')}</DescriptionItem>
    </DescriptionList>
  );
}
