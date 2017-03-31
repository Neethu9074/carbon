import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function PythonInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">
        {data.get('snapshot.name')}
      </DescriptionItem>
      <DescriptionItem title="Runtime Version">
        {data.get('snapshot.version')}
      </DescriptionItem>
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
