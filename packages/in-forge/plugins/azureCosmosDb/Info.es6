import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="State">{data.get('provisioningState')}</DescriptionItem>
        <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
        <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
        <DescriptionItem title="Kind">{data.get('kind')}</DescriptionItem>
        <DescriptionItem title="Endpoint">{data.get('documentEndpoint')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
