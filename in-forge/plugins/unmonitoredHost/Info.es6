import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="IPv4">
        {data.get('ipv4')}
      </DescriptionItem>
      <DescriptionItem title="Reverse Lookup">
        {data.get('dnsName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
