import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function GolangInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='GOROOT'>
        {data.get('snapshot.goroot')}
      </DescriptionItem>
      <DescriptionItem title='Compiler'>
        {data.get('snapshot.compiler')}
      </DescriptionItem>
      <DescriptionItem title='GOMAXPROCS'>
        {data.get('snapshot.maxprocs')}
      </DescriptionItem>
      <DescriptionItem title='Visible CPUs'>
        {data.get('snapshot.cpu')}
      </DescriptionItem>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
