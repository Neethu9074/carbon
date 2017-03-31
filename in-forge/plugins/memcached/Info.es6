import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MemcachedInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Port">
        {data.get('port')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Limit maxbytes">
        {data.get('limit_maxbytes')}
      </DescriptionItem>
      <DescriptionItem title="Max connections">
        {data.get('max_connections')}
      </DescriptionItem>
    </DescriptionList>
  );
}
