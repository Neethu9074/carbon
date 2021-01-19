/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const convertBoolToString = bool => (bool === true ? 'Yes' : 'No');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Initialized">{convertBoolToString(data.get('initialized'))}</DescriptionItem>
      <DescriptionItem title="Sealed">{convertBoolToString(data.get('sealed'))}</DescriptionItem>
      <DescriptionItem title="Standby">{convertBoolToString(data.get('standby'))}</DescriptionItem>
      <DescriptionItem title="Performance standby">
        {convertBoolToString(data.get('performanceStandBy'))}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
