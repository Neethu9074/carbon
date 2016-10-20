import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function RubyInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Ruby Version'>
        {data.get('rubyVersion')}
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
