/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="System ID">{data.get('instanceId')}</DescriptionItem>
      <DescriptionItem title="Database Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Instance Number">{data.get('instanceNumber')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Usage">{data.get('usage')}</DescriptionItem>
      <DescriptionItem title="Distributed">{data.get('distributed')}</DescriptionItem>
      <DescriptionItem title="All Services Started">{data.get('allServicesStarted')}</DescriptionItem>
      <DescriptionItem title="Maximum Number Of Sessions">{data.get('maxNumberOfSessions')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
