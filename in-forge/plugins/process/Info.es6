import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function ProcessInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Executable'>
        {data.get('exec')}
      </DescriptionItem>
      <DescriptionItem title='User'>
        {data.get('user')}
      </DescriptionItem>
      <DescriptionItem title='Group'>
        {data.get('group')}
      </DescriptionItem>
    </DescriptionList>
  );
}
