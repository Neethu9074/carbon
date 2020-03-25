import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import StatusLabel from 'in-forge/plugins/vault/StatusLabel';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Initialized">
        <StatusLabel status={data.get('initialized')} desiredState="true" />
      </DescriptionItem>
      <DescriptionItem title="Sealed">
        <StatusLabel status={data.get('sealed')} desiredState="false" />
      </DescriptionItem>
      <DescriptionItem title="Standby">
        <StatusLabel status={data.get('standby')} desiredState="false" />
      </DescriptionItem>
      <DescriptionItem title="Performance standby">
        <StatusLabel status={data.get('performanceStandBy')} desiredState="false" />
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
