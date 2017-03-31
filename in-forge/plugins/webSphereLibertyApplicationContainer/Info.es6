import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WebSphereInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Install Dir">
        {data.get('installDir')}
      </DescriptionItem>
    </DescriptionList>
  );
}
