import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function Info({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Kind'>
        {data.get('kind')}
      </DescriptionItem>
    </DescriptionList>
  );
}
