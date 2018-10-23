import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>

        <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>

        <DescriptionItem title="Publisher">{data.get('publisherName')}</DescriptionItem>

        <DescriptionItem title="Provisioning State">{data.get('provisioningState')}</DescriptionItem>

        <DescriptionItem title="Gateway Url">{data.get('gatewayUrl')}</DescriptionItem>

        <DescriptionItem title="Portal Url">{data.get('portalUrl')}</DescriptionItem>

        <DescriptionItem title="Sku">{data.get('sku')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
