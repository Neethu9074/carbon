import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ConsulInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Consul Version">{data.get('consul_version')}</DescriptionItem>
    </DescriptionList>
  );
}
