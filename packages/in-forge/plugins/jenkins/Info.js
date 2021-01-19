/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';

export default function JenkinsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const totalJobs = data.get('jobNames', emptyList).toArray().length;
  const mode = data.get('mode');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('nodeDescription')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      {mode && <DescriptionItem title="Mode">{mode.toLowerCase()}</DescriptionItem>}
      <DescriptionItem title="Executors">{data.get('executors')}</DescriptionItem>
      <DescriptionItem title="Secure Mode">{yesOrNo(data.get('useSecurity'))}</DescriptionItem>
      <DescriptionItem title="Total Jobs">{totalJobs}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
