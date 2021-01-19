/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function OracleDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Oracle SID">{data.get('databaseSID')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="CPU Count">{data.get('cpuCount')}</DescriptionItem>
      <DescriptionItem title="Max Sessions">{data.get('maxSessions')}</DescriptionItem>
      <DescriptionItem title="DB Block Size">{data.get('dbBlockSize')}</DescriptionItem>
    </DescriptionList>
  );
}
