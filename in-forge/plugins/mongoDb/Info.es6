import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MongoDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Port">
        {data.get('port')}
      </DescriptionItem>
    </DescriptionList>
  );
}
