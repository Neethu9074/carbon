import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function NodeJsInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Runtime Arguments'>
        {data.get('execArgs').join(' ')}
      </DescriptionItem>
    </DescriptionList>
  );
}
