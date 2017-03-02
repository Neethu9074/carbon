import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function Info({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Id'>
        {data.get('id')}
      </DescriptionItem>
      <DescriptionItem title='Organization'>
        {data.get('org')}
      </DescriptionItem>
      <DescriptionItem title='Space'>
        {data.get('space')}
      </DescriptionItem>
      <DescriptionItem title='API endpoint'>
        {data.get('api_endpoint')}
      </DescriptionItem>
    </DescriptionList>
  );
}
