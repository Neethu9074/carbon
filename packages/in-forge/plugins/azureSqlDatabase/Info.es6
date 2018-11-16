import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>

        <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>

        <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>

        <DescriptionItem title="FQDN">{data.get('fullyQualifiedDomainName')}</DescriptionItem>

        <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
