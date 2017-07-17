import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import HealthReportDescriptionItems from './HealthReportDescriptionItems';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Node ID">
        {data.get('nodeId')}
      </DescriptionItem>
      <HealthReportDescriptionItems snapshot={snapshot} />
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
