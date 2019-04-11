import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function JenkinsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const jobs = data.get('jobNames');
  return (
    <DescriptionList>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="PID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Mode">{data.get('mode')}</DescriptionItem>
      <DescriptionItem title="Executors">{data.get('executors')}</DescriptionItem>
      <DescriptionItem title="Node Name">{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title="Node Description">{data.get('nodeDescription')}</DescriptionItem>
      <DescriptionItem title="Use Security">{yesOrNo(data.get('useSecurity'))}</DescriptionItem>
      <DescriptionItem title="Total Jobs">{jobs != null ? jobs.size : 0}</DescriptionItem>
    </DescriptionList>
  );
}
