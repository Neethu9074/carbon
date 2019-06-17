import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function SapSqlAnywhereInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="PID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('serverType')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('serverVersion')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('serverName')}</DescriptionItem>
    </DescriptionList>
  );
}
