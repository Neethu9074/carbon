import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>

        <DescriptionItem title="State">{data.get('state')}</DescriptionItem>

        <DescriptionItem title="Location">{data.get('region')}</DescriptionItem>

        <DescriptionItem title="Resource-Group">{data.get('resourcegroup')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
