import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function GolangInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('snapshot.name')}</DescriptionItem>
      <DescriptionItem title="GOROOT">{data.get('snapshot.goroot')}</DescriptionItem>
      <DescriptionItem title="Compiler">{data.get('snapshot.compiler')}</DescriptionItem>
      <DescriptionItem title="GOMAXPROCS">{data.get('snapshot.maxprocs')}</DescriptionItem>
      <DescriptionItem title="Visible CPUs">{data.get('snapshot.cpu')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Instana Sensor Version">{data.get('snapshot.iv')}</DescriptionItem>
    </DescriptionList>
  );
}
