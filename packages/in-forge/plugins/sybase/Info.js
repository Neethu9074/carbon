/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function SybaseInfo({ snapshot }) {
  const data = snapshot.get('data');
  const databases = data.get('databaseNames', emptyList);
  return (
    <DescriptionList>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Start Time">{data.get('startTime')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('serverType')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('serverVersion')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title="Max Connections">{data.get('maxConnections')}</DescriptionItem>
      <DescriptionItem title="Databases">{databases.count()}</DescriptionItem>
    </DescriptionList>
  );
}
