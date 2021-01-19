/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getLabel } from 'in-sdk/snapshot';

export default function HaskellInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{getLabel(snapshot)}</DescriptionItem>
      <DescriptionItem title="Program">{data.get('programName')}</DescriptionItem>
      <DescriptionItem title="Executable">{data.get('executablePath')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
