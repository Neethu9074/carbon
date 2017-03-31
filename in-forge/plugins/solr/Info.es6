import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SolrInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title="Port">
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
