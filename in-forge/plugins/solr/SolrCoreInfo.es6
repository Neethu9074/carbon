import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SolrCoreInfo({ snapshot, core }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Version">
        {data.get('cores.' + core + '.version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
