import React from 'react';

import {emptyMap} from 'in-services/fixedImmutables';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function Info({snapshot}) {
  const data = snapshot.getIn(['data', 'java'], emptyMap);

  return (
    <DescriptionList>
      <DescriptionItem title='Java Version'>
        {data.get('version')}{' '}
        {data.get('vmversion')}
      </DescriptionItem>

      <DescriptionItem title='Java Runtime'>
        {data.get('vmvendor')}<br/>
        {data.get('vmname')}
      </DescriptionItem>
    </DescriptionList>
  );
}
