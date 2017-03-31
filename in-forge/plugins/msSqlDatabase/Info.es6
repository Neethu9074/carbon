import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MsSqlInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title="Instance-Name">
        {data.get('instance')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
