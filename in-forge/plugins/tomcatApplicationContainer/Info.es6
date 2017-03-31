import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function TomcatInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Home">
        {data.get('home-dir')}
      </DescriptionItem>
    </DescriptionList>
  );
}
