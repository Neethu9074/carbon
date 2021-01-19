/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import HealthcheckResultDescriptionItem from 'in-forge/plugins/nodeJsRuntimePlatform/HealthcheckResultDescriptionItem';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function NodeJsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <HealthcheckResultDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Application Arguments">{data.get('args', []).join(' ')}</DescriptionItem>
      <DescriptionItem title="Runtime Arguments">{data.get('execArgs', []).join(' ')}</DescriptionItem>
    </DescriptionList>
  );
}
