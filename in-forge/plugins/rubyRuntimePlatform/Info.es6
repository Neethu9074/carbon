import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function RubyInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Name'>
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Description'>
        {data.get('description')}
      </DescriptionItem>
      <DescriptionItem title='Application Arguments'>
        {data.get('args', []).join(' ')}
      </DescriptionItem>
      <DescriptionItem title='Runtime Arguments'>
        {data.get('execArgs', []).join(' ')}
      </DescriptionItem>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
