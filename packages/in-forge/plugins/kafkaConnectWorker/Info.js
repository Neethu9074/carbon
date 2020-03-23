import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function KafkaConnectWorkerInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Worker Name">{data.get('workerName')}</DescriptionItem>
      <DescriptionItem title="Connect Protocol">{data.get('connectProtocol')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
