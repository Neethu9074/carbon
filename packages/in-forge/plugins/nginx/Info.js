/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function NginxInfo({ snapshot }) {
  const data = snapshot.get('data');
  const isNginxPlus = snapshot.getIn(['data', 'version'], 'nginx').indexOf('nginx-plus') !== -1;

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Worker processes">{data.get('worker_processes')}</DescriptionItem>
      <DescriptionItem title="Worker connections">{data.get('worker_connections')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      {isNginxPlus && <DescriptionItem title="Build">{data.get('build')}</DescriptionItem>}
      {isNginxPlus && <DescriptionItem title="Address">{data.get('address')}</DescriptionItem>}
      {isNginxPlus && <DescriptionItem title="Generation">{data.get('generation')}</DescriptionItem>}
      {isNginxPlus && <DescriptionItem title="ppid">{data.get('ppid')}</DescriptionItem>}
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
