import React from 'react';

import InstanceStatusLabel from 'in-forge/plugins/googleCloudSQL/InstanceStatusLabel';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Status">
        <InstanceStatusLabel status={data.get('database.state')} />
      </DescriptionItem>
      <DescriptionItem title="Database version">{data.get('databaseVersion')}</DescriptionItem>
      <DescriptionItem title="Disk size">{data.get('currentDiskSize')} GB</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Zone">{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title="Tier">{data.get('tier')}</DescriptionItem>
      <DescriptionItem title="Instance type">{data.get('instanceType')}</DescriptionItem>
      <DescriptionItem title="Master">{data.get('masterInstanceName')}</DescriptionItem>
    </DescriptionList>
  );
}
