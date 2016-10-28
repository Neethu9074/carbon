import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function CLRInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Name'>
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title='CLR Version'>
        {data.get('runtimeVersion')}
      </DescriptionItem>
      <DescriptionItem title='Arguments'>
        {data.get('arguments')}
      </DescriptionItem>
    </DescriptionList>
  );
}
